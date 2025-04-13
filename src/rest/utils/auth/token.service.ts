import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenInformation, TokenType } from './token-information';

const MAX_AGE_BY_TOKEN_TYPE = {
  [TokenType.ACCESS]: '1w',
  [TokenType.REFRESH]: '1w',
};

@Injectable()
export class TokenService {
  private jwtSecret = process.env.JWT_SECRET;

  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(userId: number): Promise<string> {
    return this.generateToken(userId, TokenType.ACCESS);
  }

  generateRefreshToken(userId: number): Promise<string> {
    return this.generateToken(userId, TokenType.REFRESH);
  }

  private generateToken(userId: number, tokenType: TokenType): Promise<string> {
    const tokenInformation: TokenInformation = { userId, tokenType };

    return this.jwtService.signAsync(tokenInformation, {
      expiresIn: MAX_AGE_BY_TOKEN_TYPE[tokenType],
      secret: this.jwtSecret,
    });
  }

  getAccessTokenInformation(token: string): Promise<TokenInformation> {
    return this.getTokenInformation(token, TokenType.ACCESS);
  }

  getRefreshTokenInformation(token: string): Promise<TokenInformation> {
    return this.getTokenInformation(token, TokenType.REFRESH);
  }

  private async getTokenInformation(token: string, tokenType: TokenType): Promise<TokenInformation> {
    let tokenInformation: TokenInformation;
    try {
      tokenInformation = await this.jwtService.verifyAsync(token, { secret: this.jwtSecret });
    } catch {
      throw new UnauthorizedException();
    }

    if (tokenInformation.tokenType !== tokenType) {
      throw new ForbiddenException();
    }
    return tokenInformation;
  }
}
