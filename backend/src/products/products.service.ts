// backend/src/products/products.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository }                                   from '@nestjs/typeorm';
import { Repository }                                         from 'typeorm';
import { Product }                                            from './entities/product.entity';
import { CreateProductDto }                                   from './dto/create-product.dto';
import { UpdateProductDto }                                   from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  findAll() {
    return this.productRepository.find();
  }

  findOne(id: number) {
    return this.productRepository.findOneBy({ id });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.productRepository.update(id, updateProductDto);
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }

  /**
   * Disminuye el stock de un producto dado.
   * Lanza NotFoundException si no existe y BadRequestException si el stock es insuficiente.
   */
  async decrementStock(productId: number, quantity: number): Promise<void> {
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException(`Product ${productId} not found`);
    }
    if (product.stock < quantity) {
      throw new BadRequestException(
        `Insufficient stock for product ${productId}. Available: ${product.stock}, requested: ${quantity}`
      );
    }
    product.stock -= quantity;
    await this.productRepository.save(product);
  }
}
