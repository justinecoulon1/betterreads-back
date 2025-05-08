import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookRepositoryModule } from '../../../database/book/book.repository.module';
import { IsbnModule } from '../../utils/isbn/isbn.module';
import { BookCoverService } from './book-cover.service';
import { AuthorModule } from '../author/author.module';
import { AuthorRepositoryModule } from '../../../database/author/author.repository.module';
import { TransactionServiceModule } from '../../../database/utils/transaction/transaction.service.module';
import { ShelfRepositoryModule } from '../../../database/shelf/shelf.repository.module';
import { SearchModule } from '../search/search.module';
import { HistoryRepositoryModule } from '../../../database/history/history.repository.module';
import { ReviewModule } from '../review/review.module';

@Module({
  imports: [
    BookRepositoryModule,
    IsbnModule,
    AuthorModule,
    AuthorRepositoryModule,
    TransactionServiceModule,
    ShelfRepositoryModule,
    SearchModule,
    HistoryRepositoryModule,
    ReviewModule,
  ],
  controllers: [BookController],
  providers: [BookService, BookCoverService],
  exports: [BookService, BookCoverService],
})
export class BookModule {}
