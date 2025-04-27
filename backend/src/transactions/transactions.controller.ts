import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TransactionsService }  from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly svc: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Body() dto: CreateTransactionDto) {
    return this.svc.create(dto);
  }

  @Post(':id/confirm')
  @HttpCode(HttpStatus.OK)
  confirm(@Param('id', ParseIntPipe) id: number) {
    return this.svc.confirmPayment(id);
  }

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Get('summary/:amount')
  @HttpCode(HttpStatus.OK)
  getSummary(@Param('amount', ParseIntPipe) amount: number) {
    return this.svc.getSummary(amount);
  }
}
