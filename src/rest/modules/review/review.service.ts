import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../../../database/review/review.repository';
import { User } from '../../../database/model/user.entity';
import { Review } from '../../../database/model/review.entity';
import { BookRepository } from '../../../database/book/book.repository';
import { BookNotFoundException } from '../book/book.exceptions';
import { PaginatedReviews } from './review.types';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly bookRepository: BookRepository,
  ) {}

  async getLastAddedByBookId(bookId: number): Promise<Review[]> {
    return await this.reviewRepository.findLastByBookId(5, bookId);
  }

  async createReview(user: User, score: number, commentary: string, bookId: number): Promise<Review> {
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new BookNotFoundException();
    }

    return await this.reviewRepository.save(new Review(commentary, score, new Date(), new Date(), user, book));
  }

  async getBookAverageScore(bookId: number) {
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new BookNotFoundException();
    }
    return await this.reviewRepository.getBookAverageScore(bookId);
  }

  async getByUserId(userId: number, amount?: number) {
    if (amount) {
      return await this.reviewRepository.findLastByUserId(userId, amount);
    }
    return await this.reviewRepository.findByUserId(userId);
  }

  async getPaginatedUserReviews(userId: number, limit: number, offset: number): Promise<PaginatedReviews> {
    const review = await this.reviewRepository.findReviewsByUserId(userId, limit, offset);
    return { reviews: review.reviews, totalCount: review.totalCount };
  }
}
