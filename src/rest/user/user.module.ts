import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepositoryModule } from '../../database/user/user.repository.module';
import { AuthModule } from '../utils/auth/auth.module';

@Module({
  imports: [UserRepositoryModule, AuthModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
