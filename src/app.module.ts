import { Module } from '@nestjs/common';
import { UserModule } from './rest/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { BookModule } from './rest/books/book.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, BookModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
