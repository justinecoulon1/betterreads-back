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

  findLastByBookId(amount: number, bookId: number): Promise<Review[]> {
    return this.repository.find({
      where: {
        book: { id: bookId },
      },
      order: { createdAt: 'DESC' },
      take: amount,
    });
  }

  async getBookAverageScore(bookId: number): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('review')
      .select('AVG(review.score)', 'average_score')
      .where('review.book_id = :bookId', { bookId })
      .getRawOne<{ average_score: string | null }>();

    if (!result || result.average_score === null) {
      return 0;
    }

    return parseFloat(result.average_score);
  }

  save(review: Review): Promise<Review> {
    return this.repository.save(review);
  }
}
