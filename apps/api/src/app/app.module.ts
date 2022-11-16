import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
// import { ShibeModule } from './shibe/shibe.module';
// import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { TimeoutInterceptor } from './timeout.interceptor';
import { LoggerMiddleware } from './logger.middleware';
import { CoreModule } from '@libs/core';
import { LoggerModule } from '@libs/logger';

@Module({
  imports: [
    AuthModule,
    HealthModule,
    CatsModule,
    CoreModule,
    LoggerModule,
    // ShibeModule,
    // MongooseModule.forRoot('mongodb://127.0.0.1:27017/test'),
  ],
  controllers: [],
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
