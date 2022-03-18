import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { Logger, Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { ShibeModule } from './shibe/shibe.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuthModule,
    HealthModule,
    CatsModule,
    ShibeModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/test'),
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule {}
