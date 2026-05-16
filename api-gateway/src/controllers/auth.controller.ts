import {
  Body,
  Controller,
  Post,
  Res,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { loginUserDto } from '../dto/user-dto/loginUserDto';
import type { FastifyReply, FastifyRequest } from 'fastify';

@Controller('auth')
export class AuthController {
  constructor(@Inject('USER_SERVICE') private authClient: ClientProxy) {}

  @Post('login')
  async login(
    @Body() dto: loginUserDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    try {
      const result = await lastValueFrom(
        this.authClient.send('auth.login', dto),
      );
      console.log('Login result from microservice:', result);
      // ✅ Set cookies
      res.setCookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      res.setCookie('refreshTokenId', String(result.refreshTokenId), {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return { accessToken: result.accessToken, user: result.user };
    } catch (error: any) {
      console.error('Microservice login error:', error);

      // If the error comes from the microservice
      if (error?.response && error?.status) {
        throw new HttpException(error.response, error.status);
      }

      // Fallback for unexpected errors
      throw new HttpException(
        { message: error.message || 'Internal Error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('refresh')
  async refresh(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    const refreshTokenId = Number(req.cookies['refreshTokenId']);

    const result = await lastValueFrom(
      this.authClient.send('auth.refresh', {
        refreshToken,
        refreshTokenId,
      }),
    );

    // rotate cookies
    res.setCookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      path: '/',
      secure: false, // true only in HTTPS production
      sameSite: 'lax', // IMPORTANT
    });

    res.setCookie('refreshTokenId', String(result.refreshTokenId), {
      httpOnly: true,
      path: '/',
      secure: false, // true only in HTTPS production
      sameSite: 'lax', // IMPORTANT
    });

    return { accessToken: result.accessToken };
  }

  @Post('logout')
  async logout(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const refreshTokenId = Number(req.cookies['refreshTokenId']);

    await lastValueFrom(
      this.authClient.send('auth.logout', { refreshTokenId }),
    );

    res.clearCookie('refreshToken', { path: '/auth/refresh' });
    res.clearCookie('refreshTokenId', { path: '/auth/refresh' });

    return { success: true };
  }
}
