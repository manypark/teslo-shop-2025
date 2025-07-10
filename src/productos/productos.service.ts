import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { 
  BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException
} from '@nestjs/common';
import { validate as isUUID } from "uuid";

import { ProductImage, Product } from './entities';
import { CreateProductDto, UpdateProductoDto } from './dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)      private readonly productRepository:Repository<Product>,
    @InjectRepository(ProductImage) private readonly productImagesRepository:Repository<ProductImage>,
  ) {}

  // --------------------|| Create Product ||--------------------
  async create( createProductDto : CreateProductDto ) {

    try {

      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map( url => this.productImagesRepository.create({ url }) ),
      });

      await this.productRepository.save(product);

      return { ...product, images };

    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

// --------------------|| Find all Product ||--------------------
  async findAll( { limit = 10, offset = 0 } : PaginationDto ) {

    try {

      const products = await this.productRepository.find({
        take      : limit, 
        skip      : offset,
        relations : {
          images : true,
        }
      });

      return products.map( ({ images, ...prods }) => ({
        ...prods,
        images: images?.map( img => img.url )
      }));
      
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  // --------------------|| Find one Product ||--------------------
  async findOne( term:string ):Promise<Product> {

    let product:Product | null;

    if( !term ) throw new NotFoundException('Product not found');
    
    if( isUUID(term) ) {
      product = await this.productRepository.findOneBy({ id:term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder.where('LOWER(title) =:title or slug =:slug', {
        title : term.toLocaleLowerCase(),
        slug  : term.toLocaleLowerCase(),
      })
      .leftJoinAndSelect('prod.images','prodImages')
      .getOne();
    }

    if( !product ) throw new NotFoundException('Product not found');

    return product;
  }

  // --------------------|| Update Product ||--------------------
  async update( id:string, updateProductDto:UpdateProductoDto ) {

    const product = await this.productRepository.preload({
      id:id,
      ...updateProductDto,
      images:[],
    });

    if( !product ) throw new NotFoundException('Product not found');

    try {
      await this.productRepository.save(product);
    } catch (error) {
      this.handleDbExceptions(error);
    }

    return product;
  }

  // --------------------|| Reomve Product ||--------------------
  async remove(idProduct : string) {
    const product = await this.findOne(idProduct);

    this.productRepository.remove(product);
  }

  // --------------------|| Handle Exception ||--------------------
  private handleDbExceptions( error:any ) {
    if( error.code === '23505' ) throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Error in server');
  }

  async findOnePlain( term:string ) {
    const {images = [], ...prod} = await this.findOne( term );
    return {
      ...prod,
      images: images.map( image => image.url ),
    }
  }
}
