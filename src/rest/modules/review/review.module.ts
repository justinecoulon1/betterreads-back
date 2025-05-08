import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewRepositoryModule } from '../../../database/review/review.repository.module';

@Module({
  imports: [ReviewRepositoryModule],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
