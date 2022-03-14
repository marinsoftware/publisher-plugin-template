import { HealthModule } from './health/health.module';
import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [HealthModule, CatsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
