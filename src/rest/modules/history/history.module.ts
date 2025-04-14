import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { HistoryRepositoryModule } from '../../../database/history/history.repository.module';

@Module({
  imports: [HistoryRepositoryModule],
  controllers: [HistoryController],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
