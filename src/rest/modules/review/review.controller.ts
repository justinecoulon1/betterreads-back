import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Role } from '../../utils/roles/roles.decorator';
import { BetterreadsRequest } from '../../utils/http/betterreads-request';
import { CreateReviewRequestDto, ReviewDto } from '../../dto/review.dto';
import reviewMapper from '../../mapper/review.mapper';

@Controller('/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async getLastAdded(): Promise<ReviewDto[]> {
    return reviewMapper.toDtos(await this.reviewService.getLastAdded());
  }

  @Role('user')
  @Post()
  async createReview(
    @Req() req: BetterreadsRequest,
    @Body() createReviewRequestDto: CreateReviewRequestDto,
  ): Promise<ReviewDto> {
    return reviewMapper.toDto(
      await this.reviewService.createReview(req.user, createReviewRequestDto.score, createReviewRequestDto.commentary),
    );
  }
}
