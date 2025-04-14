import { Injectable } from '@nestjs/common';
import { HistoryRepository } from '../../../database/history/history.repository';
import { PaginatedHistory } from './history.types';

@Injectable()
export class HistoryService {
  constructor(private readonly historyRepository: HistoryRepository) {}

  async getHistoryByUserId(userId: number, limit: number, offset: number): Promise<PaginatedHistory> {
    const history = await this.historyRepository.findHistoryByUserId(userId, limit, offset);
    return { histories: history.histories, totalCount: history.totalCount };
  }
}
