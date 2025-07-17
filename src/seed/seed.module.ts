import { Module } from '@nestjs/common';

import { ProductsModule } from '../productos';
import { AuthModule } from '../auth/auth.module';
import { SeedController, SeedService } from './index';

@Module({
  controllers : [SeedController],
  providers   : [SeedService],
  imports     : [
    ProductsModule,
    AuthModule,
  ],
})
export class SeedModule {}
