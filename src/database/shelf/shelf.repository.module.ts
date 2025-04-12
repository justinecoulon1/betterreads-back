import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { ShelfRepository } from './shelf.repository';

@Module({
  imports: [DatabaseModule],
  providers: [ShelfRepository],
  exports: [ShelfRepository],
})
export class ShelfRepositoryModule {}
