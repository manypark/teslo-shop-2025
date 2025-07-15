import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { ProductsModule } from './productos/productos.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT?.toString()!,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DN_NAME,
      autoLoadEntities: true,
      synchronize: true,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        }
      }
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),
    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule,
    AuthModule,
  ],
})
export class AppModule {}
