import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './rest/modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { BookModule } from './rest/modules/book/book.module';
import { AuthorModule } from './rest/modules/author/author.module';
import { ShelfModule } from './rest/modules/shelf/shelf.module';
import { UserMiddleware } from './rest/utils/middlewares/user.middleware';
import { UserRepositoryModule } from './database/user/user.repository.module';
import { AuthModule } from './rest/utils/auth/auth.module';
import { RolesGuard } from './rest/utils/roles/roles.guard';
import { SearchModule } from './rest/modules/search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    BookModule,
    AuthorModule,
    ShelfModule,
    UserRepositoryModule,
    AuthModule,
    SearchModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*');
  }
}
