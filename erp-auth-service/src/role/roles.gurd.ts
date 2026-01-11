import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (!requiredRoles?.length) return true;

    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    if (!user?.roles) {
      throw new ForbiddenException('Access denied');
    }

    const userRoles = user.roles.map((r) => r.name);

    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
