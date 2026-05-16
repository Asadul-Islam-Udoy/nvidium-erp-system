import {
  Controller,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import '@fastify/cookie';
import { AuthService } from './auth.service';
import { loginUserDto } from '../user/dto/loginUserDto';
import { User } from '../user/user.entity';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.login')
  async login(@Payload() dto: loginUserDto) {
    try {
      const user = await this.authService.validateUser(dto.email, dto.password);
      if (!user) {
        throw new RpcException({
          statusCode: 401,
          message: 'Invalid email or password',
        });
      }

      const token = await this.authService.login(user as unknown as User);
      return {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken.token,
        refreshTokenId: token.refreshToken.id,
        user,
      };
    } catch (error: any) {
      // Log error for debugging
      console.error('Microservice login error:', error);

      // Return a proper error
      if (error instanceof RpcException) {
        throw error;
      }

      throw new RpcException({
        statusCode: 500,
        message: 'Failed to create user',
      });
    }
  }
  @MessagePattern('auth.refresh')
  async refresh(
    @Payload()
    data: {
      refreshToken: string;
      refreshTokenId: number;
    },
  ) {
    if (!data.refreshToken) {
      throw new RpcException({
        statusCode: 400,
        message: 'No refresh token',
      });
    }
    // store id too

    if (!data.refreshTokenId || isNaN(data.refreshTokenId)) {
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid refresh token id',
      });
    }
    const token = await this.authService.rotateRefreshToken(
      data.refreshTokenId,
      data.refreshToken,
    );

    // set new refresh token cookie
    // res.setCookie('refreshToken', token.refreshToken.token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   path: '/auth/refresh',
    //   maxAge: this.authService.secondsFromString(env.jwt.refreshExpiresIn),
    // });

    // res.setCookie('refreshTokenId', String(token.refreshToken.id), {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   path: '/auth/refresh',
    //   maxAge: this.authService.secondsFromString(env.jwt.refreshExpiresIn),
    // });

    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken.token,
      refreshTokenId: token.refreshToken.id,
    };
  }

  @MessagePattern('auth.logout')
  async logout(@Payload() data: { refreshTokenId: number }) {
    if (data.refreshTokenId && !isNaN(data.refreshTokenId)) {
      await this.authService.revokeRefreshToken(data.refreshTokenId);
    }

    // Clear cookies
    // res.setCookie('refreshToken', '', {
    //   path: '/auth/refresh',
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 0,
    // });

    // res.setCookie('refreshTokenId', '', {
    //   path: '/auth/refresh',
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 0,
    // });
    return { success: true };
  }

  @MessagePattern('auth.public-key')
  getPublicKey() {
    return { publicKey: this.authService.getPublicKey() };
  }
}
