import { Module } from '@nestjs/common';
import { ProductsService } from './productos.service';
import { ProductosController } from './productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/producto.entity';

@Module({
  controllers : [ProductosController],
  providers   : [ProductsService],
  imports     : [
    TypeOrmModule.forFeature([Product]),
  ]
})
export class ProductsModule {}
