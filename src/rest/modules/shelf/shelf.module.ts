import { Module } from '@nestjs/common';
import { ShelfController } from './shelf.controller';
import { ShelfService } from './shelf.service';
import { ShelfRepositoryModule } from '../../../database/shelf/shelf.repository.module';
import { TransactionServiceModule } from '../../../database/utils/transaction/transaction.service.module';
import { BookRepositoryModule } from '../../../database/book/book.repository.module';

@Module({
  imports: [ShelfRepositoryModule, TransactionServiceModule, BookRepositoryModule],
  controllers: [ShelfController],
  providers: [ShelfService],
  exports: [ShelfService],
})
export class ShelfModule {}
