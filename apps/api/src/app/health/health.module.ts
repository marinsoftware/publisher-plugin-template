import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service'
import { PublisherUtil } from "../services/publisher_utils.service"

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [HealthService, PublisherUtil]
})
export class HealthModule {}