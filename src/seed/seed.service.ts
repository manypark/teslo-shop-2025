import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { initialData } from './data/seed-data';
import { ProductsService } from '../productos';
import { User } from '../auth/entities/user.entity';


@Injectable()
export class SeedService {

  constructor(
    private readonly productServices:ProductsService,
    @InjectRepository(User)      
    private readonly userRepository:Repository<User>,
  ) {}
  
  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertNewProducts( adminUser );
    return 'SEED EXECUTED';
  }

  private async deleteTables() {

    await this.productServices.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();

    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {

    const seedUser = initialData.users;

    const users:User[] = [];

    seedUser.forEach( user => {
      users.push( this.userRepository.create(user) );
    });

    const dbUsers = await this.userRepository.save( seedUser );

    return dbUsers[0];
  }

  private async insertNewProducts( user:User ) {

    await this.productServices.deleteAllProducts();
    
    const products = initialData.products;

    const insertPromises:any = [];

    products.forEach( (product) => {
       insertPromises.push( this.productServices.create(product, user) );
    });

    await Promise.all( insertPromises );

    return true;
  }

}
