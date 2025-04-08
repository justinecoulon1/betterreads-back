import { Module } from '@nestjs/common';
import { UserModule } from './rest/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { BookModule } from './rest/book/book.module';
import { AuthorModule } from './rest/author/author.module';
import { ShelfModule } from './rest/shelf/shelf.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, BookModule, AuthorModule, ShelfModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
