import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { UserRepository } from '../../../database/user/user.repository';
import { TokenService } from '../auth/token.service';
import { BetterreadsRequest } from '../http/betterreads-request';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async use(req: BetterreadsRequest, _res: Response, next: NextFunction) {
    const accessToken = req.header('access_token');
    if (accessToken && typeof accessToken === 'string') {
      const tokenInformation = await this.tokenService.getAccessTokenInformation(accessToken);
      const user = await this.userRepository.findById(tokenInformation.userId);
      if (!user) {
        throw new ForbiddenException();
      }

      req.user = user;
    }
    next();
  }
}
