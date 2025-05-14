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

  findLastByUserId(userId: number, amount: number): Promise<Review[]> {
    return this.repository.find({
      where: {
        user: { id: userId },
      },
      order: { createdAt: 'DESC' },
      take: amount,
    });
  }

  async findReviewsByUserId(userId: number, limit: number, offset: number) {
    const [reviews, totalCount] = await Promise.all([
      this.repository.find({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
        skip: offset,
        take: limit,
        relations: {
          book: {
            authors: true,
          },
        },
      }),
      this.repository.count({
        where: { user: { id: userId } },
      }),
    ]);

    return {
      reviews,
      totalCount,
    };
  }

  findByUserId(userId: number): Promise<Review[]> {
    return this.repository.find({
      where: {
        user: { id: userId },
      },
      order: { createdAt: 'DESC' },
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
