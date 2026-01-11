import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';
import { PERMISSIONS_KEY } from './permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions?.length) return true;

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    if (!user?.roles) {
      throw new ForbiddenException('Access denied');
    }

    const userPermissions = new Set<string>();

    for (const role of user.roles) {
      for (const permission of role.permissions) {
        userPermissions.add(permission.name);
      }
    }

    return requiredPermissions.every((p) => userPermissions.has(p));
  }
}
