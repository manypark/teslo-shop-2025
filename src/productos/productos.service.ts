import { validate as isUUID } from "uuid";
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { 
  BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException
} from '@nestjs/common';

import { ProductImage, Product } from './entities';
import { User } from '../auth/entities/user.entity';
import { CreateProductDto, UpdateProductoDto } from './dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)      
    private readonly productRepository:Repository<Product>,

    @InjectRepository(ProductImage) 
    private readonly productImagesRepository:Repository<ProductImage>,

    private readonly dataSource:DataSource,
  ) {}

  // --------------------|| Create Product ||--------------------
  async create( createProductDto : CreateProductDto, user:User ) {

    try {

      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map( url => this.productImagesRepository.create({ url }) ),
        user
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
  async update( idProduct:string, updateProductDto:UpdateProductoDto, user:User ) {

    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({ id:idProduct, ...toUpdate });

    if( !product ) throw new NotFoundException('Product not found');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if( images ) {
        await queryRunner.manager.delete( ProductImage, { product: { id : idProduct } } );
        product.images = images.map( image => this.productImagesRepository.create({url:image}) );
      }

      product.user = user;

      await queryRunner.manager.save( product );

      await queryRunner.commitTransaction();

      return this.findOnePlain( idProduct );
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDbExceptions(error);
    } finally {
      await queryRunner.release();
    }

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

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

}
