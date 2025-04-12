import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { levelByRole, Role } from './roles.decorator';
import { BetterreadsRequest } from '../http/betterreads-request';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const role = this.reflector.get(Role, context.getHandler());
    if (!role) {
      return true;
    }
    const request = context.switchToHttp().getRequest<BetterreadsRequest>();
    const user = request.user;

    const expectedLevel = levelByRole[role];
    const userLevel = levelByRole[user.role];

    return userLevel >= expectedLevel;
  }
}
