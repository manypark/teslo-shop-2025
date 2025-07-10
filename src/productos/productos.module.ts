import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product, ProductImage } from './entities';
import { ProductsService } from './productos.service';
import { ProductosController } from './productos.controller';

@Module({
  controllers : [ProductosController],
  providers   : [ProductsService],
  imports     : [
    TypeOrmModule.forFeature([
      Product,
      ProductImage
    ]),
  ]
})
export class ProductsModule {}
