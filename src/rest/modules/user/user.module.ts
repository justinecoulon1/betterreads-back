import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepositoryModule } from '../../../database/user/user.repository.module';
import { AuthModule } from '../../utils/auth/auth.module';
import { TransactionServiceModule } from '../../../database/utils/transaction/transaction.service.module';
import { ShelfRepositoryModule } from '../../../database/shelf/shelf.repository.module';

@Module({
  imports: [UserRepositoryModule, AuthModule, TransactionServiceModule, ShelfRepositoryModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
