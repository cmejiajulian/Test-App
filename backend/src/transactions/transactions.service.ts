
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
    private readonly txRepo      : Repository<Transaction>,
    private readonly http        : HttpService,
    private readonly cfg         : ConfigService,
    private readonly productsSvc : ProductsService,
  ) {}

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    const tx = this.txRepo.create({
      amount      : dto.amount,
      customerInfo: dto.customerInfo,
      deliveryInfo: dto.deliveryInfo,
      status      : TransactionStatus.PENDING,
    });
    return this.txRepo.save(tx);
  }

  findAll() {
    return this.txRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const tx = await this.txRepo.findOneBy({ id });
    if (!tx) throw new NotFoundException(`Transaction ${id} not found`);
    return tx;
  }

  async confirmPayment(id: number): Promise<Transaction> {
    const tx = await this.findOne(id);

    // 1) Tokenizar la tarjeta
    const { cardNumber, expMonth, expYear, cvc, name, email } = tx.customerInfo;
    const year2 = expYear.slice(-2);
    let cardToken: string;
    try {
      const resp = await firstValueFrom(this.http.post(
        `${this.cfg.get('WOMPI_API_URL')}/tokens/cards`,
        { number: cardNumber, exp_month: expMonth, exp_year: year2, cvc, card_holder: name },
        { headers: { Authorization: `Bearer ${this.cfg.get<string>('WOMPI_PUBLIC_KEY')}` } }
      ));
      cardToken = resp.data.data.id;
    } catch (err: any) {
      console.dir(err.response?.data, { depth: null });
      throw new BadGatewayException('Error al tokenizar la tarjeta');
    }

    // 2) Obtener acceptance_token
    let acceptance_token: string;
    try {
      const resp = await firstValueFrom(
        this.http.get(`${this.cfg.get('WOMPI_API_URL')}/merchants/${this.cfg.get<string>('WOMPI_PUBLIC_KEY')}`)
      );
      acceptance_token = resp.data.data.presigned_acceptance.acceptance_token;
    } catch {
      throw new BadGatewayException('Error obteniendo acceptance_token');
    }

    // 3) Firma HMAC-SHA256 CON LA PRIVATE KEY (no con la integrity key)
    const reference     = `TX-${Date.now()}`;
    const amountInCents = Math.round(Number(tx.amount) * 100);
    const currency      = 'COP';
    const privateKey    = this.cfg.get<string>('WOMPI_PRIVATE_KEY');
    if (!privateKey) {
      throw new BadGatewayException('WOMPI_PRIVATE_KEY no definida en .env');
    }
    const stringToSign = `${reference}${amountInCents}${currency}`;
    const signature = crypto
      .createHmac('sha256', privateKey)
      .update(stringToSign)
      .digest('hex');

    // (opcional) log para depurar
    console.log('--- DEBUG FIRMA ---');
    console.log({ reference, amountInCents, currency, stringToSign, signature });

    // 4) Disparar el pago
    let wompiTx: any;
    try {
      const resp = await firstValueFrom(this.http.post(
        `${this.cfg.get('WOMPI_API_URL')}/transactions`,
        {
          amount_in_cents : amountInCents,
          currency,
          reference,
          signature,
          acceptance_token,
          payment_method: { type: 'CARD', token: cardToken, installments: 1 },
          customer_email: email,
        }
      ));
      wompiTx = resp.data.data;
    } catch (err: any) {
      console.dir(err.response?.data, { depth: null });
      throw new BadGatewayException('Error al procesar el pago con Wompi');
    }

    // 5) Actualizar la transacción local
    tx.status     = wompiTx.status as TransactionStatus;
    tx.externalId = wompiTx.id;
    await this.txRepo.save(tx);

    // 6) Descontar stock si fue aprobado
    if (tx.status === TransactionStatus.APPROVED) {
      const { productId, quantity } = tx.deliveryInfo;
      try {
        await this.productsSvc.decrementStock(productId, quantity);
      } catch (e: any) {
        console.error('Stock no actualizado:', e.message);
      }
    }

    return tx;
  }

  getSummary(amount: number) {
    const baseFee     = Math.round(amount * 0.03);
    const deliveryFee = 500;
    return {
      itemAmount: amount,
      baseFee,
      deliveryFee,
      total: amount + baseFee + deliveryFee,
    };
  }
}
