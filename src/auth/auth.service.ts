import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)      
    private readonly userRepository:Repository<User>,
  ) {}

  // --------------------|| Create User ||--------------------
  async create( createAuthDto : CreateUserDto ):Promise<Partial<User>> {
    
    try {

      const { password, ...userData } = createAuthDto;

      const newUser = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(newUser);

      return { ...userData };

    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

// --------------------|| Login User ||--------------------
  async login( { email, password } : LoginUserDto):Promise<User> {

    const loginUser = await this.userRepository.findOne({
      where : { email },
      select: { email : true, password : true },
    });

    if( !loginUser ) throw new UnauthorizedException('User not found');

    if( !bcrypt.compareSync(password, loginUser.password) ) throw new UnauthorizedException('User or Password not found');

    return loginUser;
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

  private handleDbExceptions( error:any ):never {
    if( error.code === '23505' ) throw new BadRequestException(error.detail);

    throw new InternalServerErrorException('Error in server');
  }

}
