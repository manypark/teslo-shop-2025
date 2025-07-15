import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(User) 
        private readonly userRepository:Repository<User>,
        configServices:ConfigService,
    ) {
        super({
            jwtFromRequest  : ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey     : configServices.get('JWT_SECRET') ?? '',
        });
    }

    async validate( { email } : JwtPayload ) : Promise<User> {

        const user = await this.userRepository.findOneBy({ email });

        if( !user ) throw new UnauthorizedException('Token not valid');

        if( !user.isActive ) throw new UnauthorizedException('User is not enable');

        return user;
    }

}