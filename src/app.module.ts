import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './rest/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { BookModule } from './rest/book/book.module';
import { AuthorModule } from './rest/author/author.module';
import { ShelfModule } from './rest/shelf/shelf.module';
import { UserMiddleware } from './rest/utils/middlewares/user.middleware';
import { UserRepositoryModule } from './database/user/user.repository.module';
import { AuthModule } from './rest/utils/auth/auth.module';
import { RolesGuard } from './rest/utils/roles/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    BookModule,
    AuthorModule,
    ShelfModule,
    UserRepositoryModule,
    AuthModule,
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
