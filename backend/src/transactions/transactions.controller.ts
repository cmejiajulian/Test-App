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
  Req,
  Headers,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { TransactionStatus } from './entities/transaction.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly svc: TransactionsService,
    private readonly cfg: ConfigService,
  ) {}

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
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Get('summary/:amount')
  @HttpCode(HttpStatus.OK)
  getSummary(@Param('amount', ParseIntPipe) amount: number) {
    return this.svc.getSummary(amount);
  }

  // Webhook endpoint for Wompi events
  @Post('payment_gateway/events')
  @HttpCode(HttpStatus.OK)
  async handleEvent(
    @Req() req: any,
    @Headers('wompi-signature') signature: string,
  ) {
    const rawBody = req.rawBody;
    if (!signature || !rawBody) {
      throw new BadRequestException('Falta firma o cuerpo');
    }

    const eventsKey = this.cfg.get<string>('WOMPI_EVENTS_KEY');
    if (!eventsKey) {
      throw new InternalServerErrorException('WOMPI_EVENTS_KEY no definida');
    }

    const hmac = crypto
      .createHmac('sha256', eventsKey)
      .update(rawBody)
      .digest('hex');

    if (hmac !== signature) {
      throw new BadRequestException('Firma inválida');
    }

    const payload   = JSON.parse(rawBody);
    const eventType = payload.data?.attributes?.event || payload.event || null;

    if (eventType === 'transaction.updated.status') {
      const txId      = Number(payload.data.attributes.transaction_id);
      const newStatus = payload.data.attributes.status as TransactionStatus;
      await this.svc.handleExternalStatus(txId, newStatus);
    }

    return { data: {} };
  }
}
