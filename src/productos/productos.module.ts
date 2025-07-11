import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product, ProductImage, ProductosController, ProductsService,  } from './index';

@Module({
  controllers : [ProductosController],
  providers   : [ProductsService],
  imports     : [
    TypeOrmModule.forFeature([
      Product,
      ProductImage
    ]),
  ],
  exports     : [ProductsService],
})
export class ProductsModule {}
