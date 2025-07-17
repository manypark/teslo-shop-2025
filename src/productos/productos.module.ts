import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { Product, ProductImage, ProductosController, ProductsService,  } from './index';

@Module({
  controllers : [ProductosController],
  providers   : [ProductsService],
  imports     : [
    TypeOrmModule.forFeature([
      Product,
      ProductImage
    ]),
    AuthModule,
  ],
  exports     : [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
