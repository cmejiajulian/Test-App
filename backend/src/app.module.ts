import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [AppController],
  providers: [AppService],
=======
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module'; // Agrega esto cuando crees el módulo

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Carga las variables de .env

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true, // Solo en desarrollo
    }),

    ProductsModule, // Agregar cuando hayas creado el módulo
  ],
  controllers: [],
  providers: [],
>>>>>>> 3e8ebc5 (Unifica frontend y backend correctamente (sin subrepos))
})
export class AppModule {}
