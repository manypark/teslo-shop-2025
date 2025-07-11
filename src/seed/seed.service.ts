import { Injectable } from '@nestjs/common';

import { initialData } from './data/seed-data';
import { ProductsService } from 'src/productos';


@Injectable()
export class SeedService {

  constructor(
    private readonly productServices:ProductsService
  ) {}
  
  async runSeed() {
    await this.insertNewProducts();
    return 'SEED';
  }

  private async insertNewProducts() {

    await this.productServices.deleteAllProducts();
    
    const products = initialData.products;

    const insertPromises:any = [];

    products.forEach( (product) => {
       insertPromises.push( this.productServices.create(product) );
    });

    await Promise.all( insertPromises );

    return true;
  }

}
