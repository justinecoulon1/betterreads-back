import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { HistoryRepository } from './history.repository';

@Module({
  imports: [DatabaseModule],
  providers: [HistoryRepository],
  exports: [HistoryRepository],
})
export class HistoryRepositoryModule {}
