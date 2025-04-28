// backend/src/transactions/transactions.service.ts
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

  /* ─────────────────────────────── CRUD ────────────────────────────── */

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

  /* ─────────────── Confirmación de pago con Wompi ─────────────────── */

  async confirmPayment(id: number): Promise<Transaction> {
    const tx = await this.findOne(id);

    /* 1) Tokenizar tarjeta */
    const {
      cardNumber,
      expMonth,
      expYear,
      cvc,
      name,
      email,
    } = tx.customerInfo;

    const tokenResp = await firstValueFrom(
      this.http.post(
        `${this.cfg.get('WOMPI_API_URL')}/tokens/cards`,
        {
          number     : cardNumber,
          exp_month  : expMonth,
          exp_year   : expYear.slice(-2), // “27” en vez de “2027”
          cvc,
          card_holder: name,
        },
        {
          headers: {
            Authorization: `Bearer ${this.cfg.get<string>('WOMPI_PUBLIC_KEY')}`,
          },
        },
      ),
    ).catch(e => {
      console.dir(e.response?.data, { depth: null, colors: true });
      throw new BadGatewayException('Error al tokenizar la tarjeta');
    });

    const cardToken = tokenResp.data.data.id;

    /* 2) Obtener acceptance_token */
    const accResp = await firstValueFrom(
      this.http.get(
        `${this.cfg.get('WOMPI_API_URL')}/merchants/${this.cfg.get<string>(
          'WOMPI_PUBLIC_KEY',
        )}`,
      ),
    ).catch(() => {
      throw new BadGatewayException('Error obteniendo acceptance token');
    });

    const acceptance_token =
      accResp.data.data.presigned_acceptance.acceptance_token;

    /* 3) Firma con integrity_key */
    const reference        = `TX-${Date.now()}`;
    const amountPesos      = Number(tx.amount);
    const amountInCentsStr = (amountPesos * 100).toFixed(0); // "1500000"
    const amountInCents    = Number(amountInCentsStr);
    const currency         = 'COP';

    const integrityKey = this.cfg.get<string>('WOMPI_INTEGRITY_KEY');
    if (!integrityKey)
      throw new BadGatewayException('WOMPI_INTEGRITY_KEY no definida');

    const stringToSign = `${reference}${amountInCentsStr}${currency}${integrityKey}`;
    const signature    = crypto
      .createHmac('sha256', integrityKey)
      .update(stringToSign)
      .digest('hex');

    /*  Debug opcional */
    console.log({
      amountPesos,
      amountInCentsStr,
      stringToSign,
      signature,
    });

    /* 4) Ejecutar el pago */
    const payResp = await firstValueFrom(
      this.http.post(`${this.cfg.get('WOMPI_API_URL')}/transactions`, {
        amount_in_cents : amountInCents,
        currency,
        reference,
        signature,
        acceptance_token,
        payment_method  : { type: 'CARD', token: cardToken, installments: 1 },
        customer_email  : email,
      }),
    ).catch(e => {
      console.dir(e.response?.data, { depth: null, colors: true });
      throw new BadGatewayException('Error al procesar el pago con Wompi');
    });

    const wompiTx = payResp.data.data;

    /* 5) Actualizar transacción local */
    tx.status     = wompiTx.status as TransactionStatus;
    tx.externalId = wompiTx.id;
    await this.txRepo.save(tx);

    /* 6) Descontar stock si fue aprobado */
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

  /* ─────────────────────── Resumen de fees ─────────────────────────── */

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
