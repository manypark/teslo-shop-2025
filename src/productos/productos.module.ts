import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/producto.entity';

@Module({
  controllers : [ProductosController],
  providers   : [ProductosService],
  imports     : [
    TypeOrmModule.forFeature([Product])
  ]
})
export class ProductosModule {}
