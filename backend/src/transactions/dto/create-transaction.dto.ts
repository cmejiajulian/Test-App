import { Type } from 'class-transformer'
import { IsNumber, IsObject } from 'class-validator'

export class CreateTransactionDto {
  @Type(() => Number)
  @IsNumber()
  amount: number

  @IsObject()
  customerInfo: Record<string, any>

  @IsObject()
  deliveryInfo: Record<string, any>
}
