import {
  Injectable,
  NotFoundException,
  BadGatewayException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository }       from 'typeorm';
import { HttpService }      from '@nestjs/axios';
import { firstValueFrom }   from 'rxjs';
import { ConfigService }    from '@nestjs/config';
import * as crypto          from 'crypto';

import {
  Transaction,
  TransactionStatus,
} from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ProductsService }      from '../products/products.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
    private readonly http: HttpService,
    private readonly cfg: ConfigService,
    private readonly productsSvc: ProductsService,
  ) {}

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    const tx = this.txRepo.create({ ...dto, status: TransactionStatus.PENDING });
    return this.txRepo.save(tx);
  }

  async findAll(): Promise<Transaction[]> {
    return this.txRepo.find();
  }

  async findOne(id: number): Promise<Transaction> {
    const tx = await this.txRepo.findOne({ where: { id } });
    if (!tx) throw new NotFoundException(`Transaction ${id} no encontrada`);
    return tx;
  }

  async confirmPayment(id: number): Promise<Transaction> {
    console.log('→ API URL =', this.cfg.get('WOMPI_API_URL'));
    console.log('→ PRIVATE =', this.cfg.get('WOMPI_PRIVATE_KEY')?.slice(0,8), '…');

    const tx = await this.findOne(id);
    const { cardNumber, expMonth, expYear, cvc, name, email } = tx.customerInfo;
    const twoDigitYear = expYear.toString().slice(-2);
    const privateKey    = this.cfg.get<string>('WOMPI_PRIVATE_KEY')!;

    // 1) Tokenizar tarjeta
    let cardToken: string;
    try {
      const { data } = await firstValueFrom(
        this.http.post(
          `${this.cfg.get('WOMPI_API_URL')}/tokens/cards`,
          { number: cardNumber, exp_month: expMonth, exp_year: twoDigitYear, cvc, card_holder: name },
          { headers: { Authorization: `Bearer ${privateKey}` } },
        ),
      );
      cardToken = data.data.id;
    } catch (e: any) {
      throw new BadGatewayException('Error al tokenizar la tarjeta');
    }

    // 2) Obtener acceptance_token
    let acceptance_token: string;
    try {
      const { data } = await firstValueFrom(
        this.http.get(`${this.cfg.get('WOMPI_API_URL')}/merchants/${this.cfg.get<string>('WOMPI_PUBLIC_KEY')}`),
      );
      acceptance_token = data.data.presigned_acceptance.acceptance_token;
    } catch {
      throw new BadGatewayException('Error al obtener acceptance_token');
    }

    // 3) Preparar datos y firma
    const reference     = `TX-${Date.now()}`;
    const amountInCents = Math.round(Number(tx.amount) * 100);
    const currency      = 'COP';
    const integrityKey  = this.cfg.get<string>('WOMPI_INTEGRITY_KEY')!;
    const signature     = crypto
      .createHash('sha256')
      .update(`${reference}${amountInCents}${currency}${integrityKey}`)
      .digest('hex');

    console.log('--- DEBUG FIRMA ---', { reference, amountInCents, currency, signature });

    // 4) Disparar el pago
    let wompiTx: any;
    try {
      const { data: txData } = await firstValueFrom(
        this.http.post(
          `${this.cfg.get('WOMPI_API_URL')}/transactions`,
          {
            amount_in_cents: amountInCents,
            currency,
            reference,
            signature,
            acceptance_token,
            payment_method: { type: 'CARD', token: cardToken, installments: 1 },
            customer_email: email,
          },
          { headers: { Authorization: `Bearer ${privateKey}` } },
        ),
      );
      wompiTx = txData.data;
    } catch {
      throw new BadGatewayException('Error al procesar el pago con Wompi');
    }

    // 5) Guardar resultado y descontar stock
    tx.status     = wompiTx.status as TransactionStatus;
    tx.externalId = wompiTx.id;
    await this.txRepo.save(tx);
    if (tx.status === TransactionStatus.APPROVED) {
      await this.productsSvc.decrementStock(tx.deliveryInfo.productId, tx.deliveryInfo.quantity);
    }

    return tx;
  }

  getSummary(amount: number) {
    return {
      productAmount: amount,
      baseFee:       Number(this.cfg.get<number>('BASE_FEE', 0)),
      deliveryFee:   Number(this.cfg.get<number>('DELIVERY_FEE', 0)),
      total:         amount + Number(this.cfg.get<number>('BASE_FEE', 0)) + Number(this.cfg.get<number>('DELIVERY_FEE', 0)),
    };
  }

  async handleExternalStatus(txId: number, status: TransactionStatus): Promise<void> {
    const tx = await this.findOne(txId);
    tx.status = status;
    await this.txRepo.save(tx);
    if (status === TransactionStatus.APPROVED) {
      await this.productsSvc.decrementStock(tx.deliveryInfo.productId, tx.deliveryInfo.quantity);
    }
  }
}
