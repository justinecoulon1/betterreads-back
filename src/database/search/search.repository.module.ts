import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { SearchRepository } from './search.repository';

@Module({
  imports: [DatabaseModule],
  providers: [SearchRepository],
  exports: [SearchRepository],
})
export class SearchRepositoryModule {}
