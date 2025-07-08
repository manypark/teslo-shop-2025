import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

import { Product } from './entities/producto.entity';
import { CreateProductDto, UpdateProductoDto } from './dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product) private readonly productRepository:Repository<Product>,
  ) {}

  async create( createProductDto : CreateProductDto ) {
    try {

      const product = this.productRepository.create(createProductDto);

      await this.productRepository.save(product);

      return product;

    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async findAll( { limit = 10, offset = 0 } : PaginationDto ) {

    try {
      const products = this.productRepository.find({
        take: limit,
        skip: offset,
      });

      return products;
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async findOne( idProduct:string ) {
      const product = await this.productRepository.findOneBy({ id:idProduct });

      if( !product ) throw new NotFoundException('Product not found');

      return product;
  }

  update(id: number, updateProductDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  async remove(idProduct : string) {
    const product = await this.findOne(idProduct);

    this.productRepository.remove(product);
  }

  private handleDbExceptions( error:any ) {
    if( error.code === '23505' ) throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Error in server');
  }
}
