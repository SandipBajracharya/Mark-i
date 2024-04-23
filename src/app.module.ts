import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './api/users/users.module';
import { RolesModule } from './api/roles/roles.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';
import { AuthenticationModule } from './api/authentication/authentication.module';
import { AuthenticationMiddleware } from './middleware/authentication/authentication.middleware';

@Module({
  imports: [UsersModule, RolesModule, AuthenticationModule],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('/api/*');
  }
}
