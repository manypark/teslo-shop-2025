import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers : [AuthController],
  providers   : [AuthService, JwtStrategy],
  imports     : [
    TypeOrmModule.forFeature([ User ]),
    ConfigModule,
    PassportModule.register( { defaultStrategy: 'jwt' } ),
    JwtModule.registerAsync({
      imports   : [ ConfigModule ],
      inject    : [ ConfigService ],
      useFactory: ( configServices:ConfigService ) => ({
          secret      :  configServices.get('JWT_SECRET'),
          signOptions : { expiresIn: '2h' },
      })
    }),
  ],
  exports     : [ TypeOrmModule, JwtStrategy, PassportModule, JwtModule ]
})
export class AuthModule {}
