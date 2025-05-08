import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { ReviewRepository } from './review.repository';

@Module({
  imports: [DatabaseModule],
  providers: [ReviewRepository],
  exports: [ReviewRepository],
})
export class ReviewRepositoryModule {}
