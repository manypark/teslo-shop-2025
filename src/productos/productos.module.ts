import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './entities/producto.entity';
import { ProductsService } from './productos.service';
import { ProductosController } from './productos.controller';

@Module({
  controllers : [ProductosController],
  providers   : [ProductsService],
  imports     : [
    TypeOrmModule.forFeature([Product]),
  ]
})
export class ProductsModule {}
