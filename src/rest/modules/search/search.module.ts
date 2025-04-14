import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchRepositoryModule } from '../../../database/search/search.repository.module';
import { BookRepositoryModule } from '../../../database/book/book.repository.module';
import { AuthorRepositoryModule } from '../../../database/author/author.repository.module';

@Module({
  imports: [SearchRepositoryModule, BookRepositoryModule, AuthorRepositoryModule],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
