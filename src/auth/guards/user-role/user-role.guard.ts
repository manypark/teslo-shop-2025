import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector:Reflector
  ) {}

  canActivate( context: ExecutionContext ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles:string[] = this.reflector.get( 'roles', context.getHandler() );

    return validRoles.includes('admin');
  }

}
