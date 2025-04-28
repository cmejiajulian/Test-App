import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule }   from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsModule }     from './products/products.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host:     process.env.DB_HOST,
      port:     parseInt(process.env.DB_PORT  ?? '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize:      true, // solo dev
    }),
    ProductsModule,
    TransactionsModule,
  ],
})
export class AppModule {}
