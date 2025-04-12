import { Reflector } from '@nestjs/core';

export type BetterreadRole = 'user' | 'admin' | 'moderator';

export const levelByRole = {
  user: 1,
  moderator: 2,
  admin: 10,
};

export const Role = Reflector.createDecorator<BetterreadRole>();
