import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { UserRepositoryModule } from '../../../database/user/user.repository.module';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({}), UserRepositoryModule],
  providers: [PasswordService, TokenService],
  exports: [PasswordService, TokenService],
})
export class AuthModule {}
