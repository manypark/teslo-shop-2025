import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { 
  BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException
} from '@nestjs/common';
import { validate as isUUID } from "uuid";

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
      const products = this.productRepository.find({ take: limit, skip: offset });

      return products;
      
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async findOne( term:string ) {

    let product:Product | null;

    if( !term ) throw new NotFoundException('Product not found');
    
    if( isUUID(term) ) {
      product = await this.productRepository.findOneBy({ id:term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder.where('LOWER(title) =:title or slug =:slug', {
        title : term.toLocaleLowerCase(),
        slug  : term.toLocaleLowerCase(),
      }).getOne();
    }

    if( !product ) throw new NotFoundException('Product not found');

    return product;
  }

  async update( id:string, updateProductDto:UpdateProductoDto ) {

    const product = await this.productRepository.preload({
      id:id,
      ...updateProductDto,
    });

    if( !product ) throw new NotFoundException('Product not found');

    try {
      await this.productRepository.save(product);
    } catch (error) {
      this.handleDbExceptions(error);
    }

    return product;
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
