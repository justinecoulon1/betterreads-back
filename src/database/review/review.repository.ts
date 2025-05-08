import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Review } from '../model/review.entity';

@Injectable()
export class ReviewRepository {
  private repository: Repository<Review>;

  constructor(
    @Inject('DATA_SOURCE')
    dataSource: DataSource,
  ) {
    this.repository = dataSource.getRepository(Review);
  }

  findLast(amount: number): Promise<Review[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
      take: amount,
    });
  }

  save(review: Review): Promise<Review> {
    return this.repository.save(review);
  }
}
