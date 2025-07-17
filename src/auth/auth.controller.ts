import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Post, Body, UseGuards, } from '@nestjs/common';

import { ValidRoles } from './interfaces';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto, } from './dto';
import { Auth, GetRawHeaders, GetUser } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }
  
  @Post('login')
  loginUser( @Body() loginUserDto : LoginUserDto ) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute( 
    @GetUser() user:User,
    @GetUser('email') userEmail:User,
    @GetRawHeaders() headers:string[],
  ) {
    return {
      ok  : true,
      msg : 'Hola que hace',
      user,
      userEmail,
      headers
    }
  }

  @Get('private2')
  @RoleProtected( ValidRoles.admin, ValidRoles.superAdmin, ValidRoles.user )
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2( 
    @GetUser() user:User,
  ) {
    return {
      ok  : true,
      user,
    }
  }

  @Get('private3')
  @Auth()
  privateRoute3( 
    @GetUser() user:User,
  ) { return { ok:true, user }; }

}
