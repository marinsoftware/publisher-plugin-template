import { Module, Logger } from '@nestjs/common';
import { CampaignController } from "./campaign.controller";
import { PublisherApiService } from "../services/publisher_api.service";
import { PublisherUtil } from "../services/publisher_utils.service"
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  controllers: [CampaignController],
  providers: [PublisherApiService, PublisherUtil, Logger]
})
export class CampaignModule {}
