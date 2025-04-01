import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { BookRepository } from './book.repository';

@Module({
  imports: [DatabaseModule],
  providers: [BookRepository],
  exports: [BookRepository],
})
export class BookRepositoryModule {}
