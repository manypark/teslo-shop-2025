import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)      
    private readonly userRepository:Repository<User>,
  ) {}

  // --------------------|| Create User ||--------------------
  async create( createAuthDto : CreateUserDto ) {
    
    try {

      const newUser = this.userRepository.create({...createAuthDto});

      await this.userRepository.save(newUser);

      return { ...newUser };

    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  // --------------------|| Get all User ||--------------------
  findAll() {
    return `This action returns all auth`;
  }

  // --------------------|| Find one User ||--------------------
  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  // --------------------|| Update User ||--------------------
  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  // --------------------|| Remove User ||--------------------
  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

    private handleDbExceptions( error:any ) {
      if( error.code === '23505' ) throw new BadRequestException(error.detail);
  
      throw new InternalServerErrorException('Error in server');
    }

}
