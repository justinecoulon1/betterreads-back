import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenInformation } from './token-information';

const MAX_ACCESS_TOKEN_AGE = 60;

@Injectable()
export class TokenService {
  private jwtSecret = `${process.env.TOKEN_SECRET}`;

  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(userId: number): Promise<string> {
    const tokenInformation: TokenInformation = { userId };

    return this.jwtService.signAsync(tokenInformation, {
      expiresIn: MAX_ACCESS_TOKEN_AGE,
      secret: this.jwtSecret,
    });
  }

  getAccessTokenInformation(token: string): Promise<TokenInformation> {
    try {
      return this.jwtService.verifyAsync(token, { secret: this.jwtSecret });
    } catch {
      throw new UnauthorizedException();
    }
  }
}
