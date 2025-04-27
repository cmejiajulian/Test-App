import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository }               from '@nestjs/typeorm';
import { Repository }                     from 'typeorm';
import { Transaction, TransactionStatus } from './entities/transaction.entity';
import { CreateTransactionDto }           from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
  ) {}

  /**
   * Crea una nueva transacción en estado PENDING
   */
  async create(dto: CreateTransactionDto): Promise<Transaction> {
    // 1) Instanciar la entidad usando el DTO
    const tx = this.repo.create({
      amount: dto.amount,
      customerInfo: dto.customerInfo,
      deliveryInfo: dto.deliveryInfo,
      status: TransactionStatus.PENDING,
    });

    // 2) Guardar en DB
    return this.repo.save(tx);
  }

  /**
   * Retorna todas las transacciones
   */
  findAll(): Promise<Transaction[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  /**
   * Busca una transacción por ID
   * @throws NotFoundException si no existe
   */
  async findOne(id: number): Promise<Transaction> {
    const tx = await this.repo.findOneBy({ id });
    if (!tx) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return tx;
  }
}
