import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

import { LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)      
    private readonly userRepository:Repository<User>,
    private readonly jwtServices:JwtService
  ) {}

  // --------------------|| Create User ||--------------------
  async create( createAuthDto : CreateUserDto ) {
    
    try {

      const { password, ...userData } = createAuthDto;

      const newUser = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(newUser);

      return {
      ...userData,
      token: this.getJwtToken({ idUser:newUser.idUser }),
    };

    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

// --------------------|| Login User ||--------------------
  async login( { email, password } : LoginUserDto) {

    const loginUser = await this.userRepository.findOne({
      where : { email },
      select: { email : true, password : true, idUser: true },
    });

    if( !loginUser ) throw new UnauthorizedException('User not found');

    if( !bcrypt.compareSync(password, loginUser.password) ) throw new UnauthorizedException('User or Password not found');

    return {
      ...loginUser,
      token: this.getJwtToken({ idUser:loginUser.idUser }),
    };
  }

  private getJwtToken( payload:JwtPayload ):string {

    const token = this.jwtServices.sign(payload);

    return token;
  }

  async checkAuthStatus( user:User ) {

    return {
      ...user,
      token: this.getJwtToken({ idUser:user.idUser }),
    };

  }

  private handleDbExceptions( error:any ):never {
    if( error.code === '23505' ) throw new BadRequestException(error.detail);

    throw new InternalServerErrorException('Error in server');
  }

}
