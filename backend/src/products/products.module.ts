import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  providers: [ProductsService],
  controllers: [ProductsController]
=======
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
>>>>>>> 3e8ebc5 (Unifica frontend y backend correctamente (sin subrepos))
})
export class ProductsModule {}
