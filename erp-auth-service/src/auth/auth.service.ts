import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from '../token/refresh-token.entity';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import path from 'path';
import { env } from '../config/env';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';

export interface JwtUser {
  id: number;
  email: string;
}

export interface JwtPayload {
  sub: number;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: { token: string; id: number };
}
@Injectable()
export class AuthService {
  private readonly privateKey: string;
  private readonly publicKey: string;

  constructor(
    @InjectRepository(RefreshToken) private tokenRepo: Repository<RefreshToken>,
    private readonly userService: UserService,
    private readonly jwt: JwtService,
  ) {
    const privateKeyPath = path.join(
      process.cwd(),
      'src',
      'config',
      'keys',
      'jwt_private.pem',
    );
    const publicKeyPath = path.join(
      process.cwd(),
      'src',
      'config',
      'keys',
      'jwt_public.pem',
    );

    this.privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    this.publicKey = fs.readFileSync(publicKeyPath, 'utf8');
  }
  async validateUser(email: string, passs: string): Promise<JwtUser> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found!');
    const isMatch = await user.comparePassword(passs);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    return { id: user.id, email: user.email };
  }

  async createAccessToken(user: User): Promise<string> {
    const roles = user.roles?.map((r) => r.name) ?? [];
    const permissions = Array.from(
      new Set(
        user.roles?.flatMap((r) => r.permissions?.map((p) => p.name) ?? []) ??
          [],
      ),
    );

    if (!roles.length || !permissions.length) {
      throw new UnauthorizedException('User role or permissions not loaded');
    }
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles,
      permissions,
    };
    return await this.jwt.signAsync(payload, {
      algorithm: 'RS256',
      privateKey: this.privateKey,
      expiresIn: env.jwt.expiresIn,
    } as JwtSignOptions);
  }

  async createRefreshToken(user: User) {
    const raw = this.generateSecureRandomToken();
    const hash = await bcrypt.hash(raw, 10);

    const expiresAt = new Date(
      Date.now() + this.msFromString(env.jwt.refreshExpiresIn),
    );

    const existing = await this.tokenRepo.findOne({
      where: { user: { id: user.id } },
    });

    if (existing) {
      // UPDATE
      existing.tokenHash = hash;
      existing.expiresAt = expiresAt;
      existing.revoked = false;

      await this.tokenRepo.save(existing);

      return { token: raw, id: existing.id };
    }

    // CREATE
    const rt = this.tokenRepo.create({
      user,
      tokenHash: hash,
      expiresAt,
      revoked: false,
    });

    await this.tokenRepo.save(rt);

    return { token: raw, id: rt.id };
  }

  async rotateRefreshToken(tokenId: number, tokenRaw: string) {
    const rt = await this.tokenRepo.findOne({
      where: { id: tokenId },
      relations: ['user'],
    });

    if (!rt || rt.revoked)
      throw new UnauthorizedException('Invalid refresh token');
    const isMatch = await bcrypt.compare(tokenRaw, rt.tokenHash);
    if (!isMatch) {
      rt.revoked = true;
      await this.tokenRepo.save(rt);
      throw new UnauthorizedException('Invalid refresh token');
    }
    rt.revoked = true;
    await this.tokenRepo.save(rt);
    const newRefresh = await this.createRefreshToken(rt.user);
    const accessToken = await this.createAccessToken(rt.user);
    return { accessToken, refreshToken: newRefresh };
  }

  async revokeRefreshToken(tokenId: number) {
    await this.tokenRepo.update({ id: tokenId }, { revoked: true });
  }
  private generateSecureRandomToken() {
    return crypto.randomBytes(64).toString('hex');
  }

  private msFromString(str: string) {
    if (str.endsWith('d')) return parseInt(str) * 24 * 3600 * 1000;
    if (str.endsWith('h')) return parseInt(str) * 3600 * 1000;
    return parseInt(str) * 1000;
  }

  secondsFromString(str: string): number {
    if (str.endsWith('d')) return parseInt(str) * 24 * 60 * 60;
    if (str.endsWith('h')) return parseInt(str) * 60 * 60;
    if (str.endsWith('m')) return parseInt(str) * 60;
    return parseInt(str);
  }

  async login(user: User): Promise<TokenResponse> {
    const fullUser = await this.findOneWithRolesAndPermissions(user.id);
    if (!fullUser) {
      throw new UnauthorizedException('User not found');
    }
    const accessToken = await this.createAccessToken(fullUser);
    const refreshToken = await this.createRefreshToken(fullUser);
    return { accessToken, refreshToken };
  }

  async getPublicKey(): Promise<string> {
    return Promise.resolve(this.publicKey.toString());
  }

  async findOneWithRolesAndPermissions(userId: number) {
    const user = await this.userService.findOneWithRolesAndPermissions(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
