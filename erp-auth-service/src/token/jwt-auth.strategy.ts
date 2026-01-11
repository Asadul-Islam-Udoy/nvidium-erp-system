// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import * as fs from 'fs';
import path from 'path';
import { env } from '../config/env';
import { UserService } from '../user/user.service';

interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: fs.readFileSync(
        path.resolve(process.cwd(), env.jwt.publicKeyPath),
        'utf8',
      ),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayload) {
    // Fetch user along with roles and permissions
    const user = await this.userService.findOneWithRolesAndPermissions(
      payload.sub,
    );

    if (!user) {
      throw new UnauthorizedException('User not found!');
    }

    // Now TypeScript knows `user` is not null
    return {
      id: user.id,
      email: user.email,
      roles:
        user.roles?.map((role) => ({
          id: role.id,
          name: role.name,
          permissions:
            role.permissions?.map((p) => ({ id: p.id, name: p.name })) || [],
        })) || [],
    };
  }
}
