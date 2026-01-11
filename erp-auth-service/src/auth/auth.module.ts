import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshToken } from '../token/refresh-token.entity';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import path from 'path';
import { env } from '../config/env';
import { JwtStrategy } from '../token/jwt-auth.strategy';
import * as fs from 'fs';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    UserModule,
    JwtModule.register({
      privateKey: fs.readFileSync(
        path.join(process.cwd(), 'src/config/keys/jwt_private.pem'),
        'utf8',
      ),
      publicKey: fs.readFileSync(
        path.join(process.cwd(), 'src/config/keys/jwt_public.pem'),
        'utf8',
      ),
      signOptions: { algorithm: 'RS256', expiresIn: Number(env.jwt.expiresIn) },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
