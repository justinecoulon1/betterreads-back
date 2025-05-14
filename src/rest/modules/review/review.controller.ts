import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Role } from '../../utils/roles/roles.decorator';
import { BetterreadsRequest } from '../../utils/http/betterreads-request';
import {
  BookReviewInfoDto,
  CreateReviewRequestDto,
  PaginatedReviewDto,
  ReviewDto,
  UserReviewDto,
} from '../../dto/review.dto';
import reviewMapper from '../../mapper/review.mapper';

@Controller('/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('last-added/:bookId')
  async getLastAdded(@Param('bookId', ParseIntPipe) bookId: number): Promise<ReviewDto[]> {
    return reviewMapper.toDtos(await this.reviewService.getLastAddedByBookId(bookId));
  }

  @Get('/last')
  async getLastByUserId(@Req() req: BetterreadsRequest): Promise<UserReviewDto[]> {
    return reviewMapper.toUserDtos(await this.reviewService.getByUserId(req.user.id, 5));
  }

  @Get('/:bookId')
  async getBookReviewInfo(@Param('bookId', ParseIntPipe) bookId: number): Promise<BookReviewInfoDto> {
    const lastAddedReviews = await reviewMapper.toDtos(await this.reviewService.getLastAddedByBookId(bookId));
    const averageScore = await this.reviewService.getBookAverageScore(bookId);
    return { averageScore, lastAddedReviews };
  }

  @Role('user')
  @Post()
  async createReview(
    @Req() req: BetterreadsRequest,
    @Body() createReviewRequestDto: CreateReviewRequestDto,
  ): Promise<ReviewDto> {
    return reviewMapper.toDto(
      await this.reviewService.createReview(
        req.user,
        createReviewRequestDto.score,
        createReviewRequestDto.commentary,
        createReviewRequestDto.bookId,
      ),
    );
  }

  @Role('user')
  @Get()
  async getUserReviews(
    @Req() req: BetterreadsRequest,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('offset', ParseIntPipe) offset: number,
  ): Promise<PaginatedReviewDto> {
    const result = await this.reviewService.getPaginatedUserReviews(req.user.id, limit, offset);
    return { reviews: await reviewMapper.toUserDtos(result.reviews), totalCount: result.totalCount };
  }
}
