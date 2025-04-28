import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum TransactionStatus {
  PENDING  = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column('jsonb')
  customerInfo: Record<string, any>;

  @Column('jsonb')
  deliveryInfo: Record<string, any>;

  @Column({ nullable: true })
  externalId?: string;

  @CreateDateColumn()
  createdAt: Date;
}
