import { 
  Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query
} from '@nestjs/common';

import { ProductsService } from './productos.service';
import { CreateProductDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('products')
export class ProductosController {

  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductoDto: CreateProductDto) {
    return this.productsService.create(createProductoDto);
  }

  @Get()
  findAll( @Query() paginationDto:PaginationDto ) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  findOne( @Param( 'term' ) term:string ) {
    return this.productsService.findOne(term);
  }

  @Patch(':id')
  update(
    @Param( 'id', ParseUUIDPipe ) id:string, 
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productsService.update(id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
  
}
