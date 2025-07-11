import { Module } from '@nestjs/common';

import { ProductsModule } from 'src/productos';
import { SeedController, SeedService } from './index';

@Module({
  controllers : [SeedController],
  providers   : [SeedService],
  imports     : [ProductsModule],
})
export class SeedModule {}
