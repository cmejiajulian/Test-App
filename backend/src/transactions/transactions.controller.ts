import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
  import { TransactionsService } from './transactions.service';
  import { CreateTransactionDto } from './dto/create-transaction.dto';
  
  @Controller('transactions')
  export class TransactionsController {
    constructor(private readonly svc: TransactionsService) {}
  
    /**
     * POST /transactions
     * Crea una transacción en estado PENDING y devuelve el objeto creado (incluye id)
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    create(@Body() dto: CreateTransactionDto) {
      return this.svc.create(dto);
    }
  
    /**
     * GET /transactions
     * Lista todas las transacciones
     */
    @Get()
    findAll() {
      return this.svc.findAll();
    }
  
    /**
     * GET /transactions/:id
     * Devuelve una transacción por su ID
     */
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.svc.findOne(id);
    }
  }
  