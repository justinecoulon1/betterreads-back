import { Module } from '@nestjs/common';
import { IsbnService } from './isbn.service';

@Module({
  providers: [IsbnService],
  exports: [IsbnService],
})
export class IsbnModule {}
