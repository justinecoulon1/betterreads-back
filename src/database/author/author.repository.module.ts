import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { AuthorRepository } from './author.repository';

@Module({
  imports: [DatabaseModule],
  providers: [AuthorRepository],
  exports: [AuthorRepository],
})
export class AuthorRepositoryModule {}
