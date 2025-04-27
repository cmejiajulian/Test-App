import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository }               from '@nestjs/typeorm';
import { Repository }                     from 'typeorm';
import { HttpService }                    from '@nestjs/axios';
import { firstValueFrom }                 from 'rxjs';
import { ConfigService }                  from '@nestjs/config';

import { Transaction, TransactionStatus } from './entities/transaction.entity';
import { CreateTransactionDto }           from './dto/create-transaction.dto';
import { ProductsService }                from '../products/products.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,

    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly productsSvc: ProductsService,
  ) {}

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    const tx = this.txRepo.create({
      amount: dto.amount,
      customerInfo: dto.customerInfo,
      deliveryInfo: dto.deliveryInfo,
      status: TransactionStatus.PENDING,
    });
    return this.txRepo.save(tx);
  }

  findAll(): Promise<Transaction[]> {
    return this.txRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Transaction> {
    const tx = await this.txRepo.findOneBy({ id });
    if (!tx) throw new NotFoundException(`Transaction ${id} not found`);
    return tx;
  }

  /**
   * GET /transactions/summary/:amount
   * Calcula y devuelve itemAmount, baseFee (3%), deliveryFee fijo y total.
   */
  getSummary(amount: number) {
    const itemAmount  = amount;
    const baseFee     = Math.ceil(itemAmount * 0.03); // 3%
    const deliveryFee = 500;
    return {
      itemAmount,
      baseFee,
      deliveryFee,
      total: itemAmount + baseFee + deliveryFee,
    };
  }

  /**
   * POST /transactions/:id/confirm
   * Llama a Wompi, actualiza estado + externalId, y decrementa stock si fue APPROVED
   */
  async confirmPayment(id: number): Promise<Transaction> {
    const tx = await this.findOne(id);

    const payload = {
      amount_in_cents: Math.round(Number(tx.amount) * 100),
      payer: {
        type: 'CARD',
        token: tx.customerInfo.cardToken,
      },
      customer_email: tx.customerInfo.email,
    };

    const url  = `${this.config.get<string>('WOMPI_API_URL')}/transactions`;
    const resp = await firstValueFrom(this.http.post(url, payload));
    const data = resp.data.data;

    tx.status     = data.status as TransactionStatus;
    tx.externalId = data.id;
    await this.txRepo.save(tx);

    if (tx.status === TransactionStatus.APPROVED) {
      const { productId, quantity } = tx.deliveryInfo;
      await this.productsSvc.decrementStock(productId, quantity);
    }

    return tx;
  }
}
