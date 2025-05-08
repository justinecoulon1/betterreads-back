import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../../../database/review/review.repository';
import { User } from '../../../database/model/user.entity';
import { Review } from '../../../database/model/review.entity';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async getLastAdded(): Promise<Review[]> {
    return await this.reviewRepository.findLast(5);
  }

  async createReview(user: User, score: number, commentary: string): Promise<Review> {
    return await this.reviewRepository.save(new Review(commentary, score, new Date(), new Date(), user));
  }
}
