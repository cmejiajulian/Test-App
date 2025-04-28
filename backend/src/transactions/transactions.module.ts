import { Module }                       from '@nestjs/common';
import { TypeOrmModule }                from '@nestjs/typeorm';
import { HttpModule }                   from '@nestjs/axios';
import { ConfigModule, ConfigService }  from '@nestjs/config';

import { Transaction }            from './entities/transaction.entity';
import { TransactionsService }    from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { ProductsModule }         from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),

    // Todas las peticiones a Wompi usarán por defecto la clave privada
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject : [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        baseURL: cfg.get<string>('WOMPI_API_URL'),
        headers: {
          Authorization: `Bearer ${cfg.get<string>('WOMPI_PRIVATE_KEY')}`,
          'Content-Type': 'application/json',
        },
      }),
    }),

    ProductsModule,
  ],
  providers  : [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
