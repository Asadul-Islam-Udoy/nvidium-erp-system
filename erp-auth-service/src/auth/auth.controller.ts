import {
  Body,
  Controller,
  Post,
  Res,
  Get,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import '@fastify/cookie';
import { AuthService } from './auth.service';
import { loginUserDto } from '../user/dto/loginUserDto';
import { User } from '../user/user.entity';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { env } from '../config/env';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: loginUserDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    const token = await this.authService.login(user as unknown as User);

    res.setCookie('refreshToken', token.refreshToken.token, {
      httpOnly: true,
      path: '/auth/refresh', // must start with /
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: this.authService.secondsFromString(env.jwt.refreshExpiresIn),
    });
    res.setCookie('refreshTokenId', String(token.refreshToken.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: this.authService.secondsFromString(env.jwt.refreshExpiresIn),
    });
    return {
      accessToken: token.accessToken,
    };
  }
  @Post('refresh')
  async refresh(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    const tokenIdRaw = req.cookies['refreshTokenId'];
    // store id too

    if (!tokenIdRaw) {
      throw new UnauthorizedException('Missing refresh token id');
    }
    const tokenId = Number(tokenIdRaw);

    if (Number.isNaN(tokenId)) {
      throw new UnauthorizedException('Invalid refresh token id');
    }
    const token = await this.authService.rotateRefreshToken(
      tokenId,
      refreshToken,
    );

    // set new refresh token cookie
    res.setCookie('refreshToken', token.refreshToken.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: this.authService.secondsFromString(env.jwt.refreshExpiresIn),
    });

    res.setCookie('refreshTokenId', String(token.refreshToken.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: this.authService.secondsFromString(env.jwt.refreshExpiresIn),
    });

    return { accessToken: token.accessToken };
  }

  @Post('logout')
  async logout(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const tokenIdRaw = req.cookies['refreshTokenId'];

    if (tokenIdRaw) {
      const tokenId = Number(tokenIdRaw);
      if (!Number.isNaN(tokenId)) {
        await this.authService.revokeRefreshToken(tokenId);
      }
    }

    // Clear cookies
    res.setCookie('refreshToken', '', {
      path: '/auth/refresh',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
    });

    res.setCookie('refreshTokenId', '', {
      path: '/auth/refresh',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
    });
    return { success: true };
  }

  @Get('public-key')
  getPublicKey() {
    return { publicKey: this.authService.getPublicKey() };
  }
}
