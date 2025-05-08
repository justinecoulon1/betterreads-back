import { Body, Controller, Get, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Role } from '../../utils/roles/roles.decorator';
import { BetterreadsRequest } from '../../utils/http/betterreads-request';
import { CreateReviewRequestDto, ReviewDto } from '../../dto/review.dto';
import reviewMapper from '../../mapper/review.mapper';

@Controller('/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('/:bookId')
  async getLastAdded(@Param('bookId', ParseIntPipe) bookId: number): Promise<ReviewDto[]> {
    return reviewMapper.toDtos(await this.reviewService.getLastAddedByBookId(bookId));
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
}
