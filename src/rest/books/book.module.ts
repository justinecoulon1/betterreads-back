import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookRepositoryModule } from '../../database/book/book.repository.module';
import { IsbnModule } from '../utils/isbn/isbn.module';
import { BookCoverService } from './book-cover.service';

@Module({
  imports: [BookRepositoryModule, IsbnModule],
  controllers: [BookController],
  providers: [BookService, BookCoverService],
  exports: [BookService, BookCoverService],
})
export class BookModule {}
