import { Module } from '@nestjs/common';
import { AuthorRepositoryModule } from '../../database/author/author.repository.module';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';

@Module({
  imports: [AuthorRepositoryModule],
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [AuthorService],
})
export class AuthorModule {}
