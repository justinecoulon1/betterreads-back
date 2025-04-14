import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { History } from '../model/history.entity';

@Injectable()
export class HistoryRepository {
  private repository: Repository<History>;

  constructor(
    @Inject('DATA_SOURCE')
    dataSource: DataSource,
  ) {
    this.repository = dataSource.getRepository(History);
  }

  async findHistoryByUserId(userId: number, limit: number, offset: number) {
    const [histories, totalCount] = await Promise.all([
      this.repository.find({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
        skip: offset,
        take: limit,
        relations: { book: true },
      }),
      this.repository.count({
        where: { user: { id: userId } },
      }),
    ]);

    return {
      histories,
      totalCount,
    };
  }

  save(history: History): Promise<History> {
    return this.repository.save(history);
  }
}
