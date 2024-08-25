import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './api/users/users.module';
import { RolesModule } from './api/roles/roles.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';
import { AuthenticationModule } from './api/authentication/authentication.module';
import { AuthenticationMiddleware } from './middleware/authentication/authentication.middleware';
import { HomeController } from './api/home.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from './config/redisStore.config';
// import { ConfigModule } from '@nestjs/config';
// import { QueueModule } from './module/rabbit-mq/queue.module';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    AuthenticationModule,
    // MailerModule.forRoot({
    //   transport: {
    //     // host: 'smtp.gmail.com',
    //     // port: 587,
    //     // secure: false, // true for 465, false for other ports
    //     // auth: {
    //     //   user: 'sndp07.sb@gmail.com',
    //     //   pass: 'fyizavwoxynpqftr', // Replace with app password
    //     // },
    //     host: 'sandbox.smtp.mailtrap.io',
    //     port: 2525,
    //     auth: {
    //       user: 'ad180b50a69e19',
    //       pass: '6fc9d15e41ecf2',
    //     },
    //   },
    // }),
    // CacheModule.register({ // uses in-memory cache
    //   // ttl: 3600,
    //   // max: 10,
    //   isGlobal: true, // cache module is globally avaiable.
    // }),
    // ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync(RedisOptions),
    // QueueModule,
  ],
  controllers: [HomeController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
    // {
    //   provide: APP_INTERCEPTOR, // cache whole application (only get functions)
    //   useClass: CacheInterceptor,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('/api/*'); // configure middleware for routes starting with /api/
  }
}
