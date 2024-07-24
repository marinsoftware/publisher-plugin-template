import { HealthModule } from './health/health.module';
import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { TimeoutInterceptor } from './timeout.interceptor';
import { LoggerMiddleware } from './logger.middleware';
import { CoreModule } from '@libs/core';
import { LoggerModule } from '@libs/logger';
import { CampaignModule } from "./campaigns/campaign.module";
import { AdGroupModule } from "./groups/ad-group.module";
import { ShoppingProductsModule } from "./shopping-products/shopping-products.module";
import { AdItemsModule } from "./items/ad-items.module";
import { SnapshotModuleModule } from "./snapshot/snapshot.module";
import { OAuthModule } from './oauth/oauth.module';
import { PropertiesModule } from "./properties/properties.module";
import { KeywordModule } from "./keywords/keywords.module"

@Module({
  imports: [
    HealthModule,
    CoreModule,
    LoggerModule,
    // MongooseModule.forRoot('mongodb://127.0.0.1:27017/test'),
    CampaignModule,
    AdGroupModule,
    ShoppingProductsModule,
    AdItemsModule,
    SnapshotModuleModule,
    LoggerModule,
    OAuthModule,
    PropertiesModule,
    KeywordModule
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
      useClass: TimeoutInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
