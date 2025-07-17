import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector:Reflector
  ) {}

  canActivate( ctx: ExecutionContext ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles:string[] = this.reflector.get( META_ROLES, ctx.getHandler() );

    if( !validRoles ) return true;
    if( validRoles.length === 0 ) return true;

    const req  = ctx.switchToHttp().getRequest();
    const user = req.user;

    if( !user ) throw new BadRequestException('User not found');

    for ( const item of user.roles ) {
      if( validRoles.includes(item) ) {
        return true;
      }
    }

    throw new ForbiddenException(`User ${user.fullName} need a valid role`);
  }

}
