import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookRepositoryModule } from '../../database/book/book.repository.module';
import { IsbnModule } from '../utils/isbn/isbn.module';
import { BookCoverService } from './book-cover.service';
import { AuthorModule } from '../author/author.module';
import { AuthorRepositoryModule } from '../../database/author/author.repository.module';
import { TransactionServiceModule } from '../../database/utils/transaction/transaction.service.module';

@Module({
  imports: [BookRepositoryModule, IsbnModule, AuthorModule, AuthorRepositoryModule, TransactionServiceModule],
  controllers: [BookController],
  providers: [BookService, BookCoverService],
  exports: [BookService, BookCoverService],
})
export class BookModule {}
