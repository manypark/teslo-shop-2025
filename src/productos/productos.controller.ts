import { 
  Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query
} from '@nestjs/common';

import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { ProductsService } from './productos.service';

import { CreateProductDto, UpdateProductoDto } from './dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('products')
export class ProductosController {

  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()
  create(
    @Body() createProductoDto: CreateProductDto,
    @GetUser() user:User,
  ) {
    return this.productsService.create(createProductoDto, user);
  }

  @Get()
  findAll( @Query() paginationDto:PaginationDto ) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  findOne( @Param( 'term' ) term:string ) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  update(
    @Param( 'id', ParseUUIDPipe ) id:string, 
    @Body() updateProductoDto: UpdateProductoDto,
    @GetUser() user:User,
  ) {
    return this.productsService.update(id, updateProductoDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
  
}
