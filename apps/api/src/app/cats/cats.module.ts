import {  Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { HealthModule } from '../health/health.module';

@Module({
  imports: [HealthModule],
  controllers: [CatsController],
  providers: [CatsService]
})
export class CatsModule {}
