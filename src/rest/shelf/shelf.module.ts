import { Module } from '@nestjs/common';
import { ShelfController } from './shelf.controller';
import { ShelfService } from './shelf.service';
import { ShelfRepositoryModule } from '../../database/shelf/shelf.repository.module';
import { UserRepositoryModule } from '../../database/user/user.repository.module';

@Module({
  imports: [ShelfRepositoryModule, UserRepositoryModule],
  controllers: [ShelfController],
  providers: [ShelfService],
  exports: [ShelfService],
})
export class ShelfModule {}
