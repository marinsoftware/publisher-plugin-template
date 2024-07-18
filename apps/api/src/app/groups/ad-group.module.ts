import { Module, Logger } from '@nestjs/common';
import { AdGroupsController } from "./ad-groups.controller";
import { CampaignController } from "../campaigns/campaign.controller"
import { PublisherApiService } from "../services/publisher_api.service";
import { PublisherUtil } from "../services/publisher_utils.service"
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  controllers: [AdGroupsController],
  providers: [PublisherApiService, PublisherUtil, Logger, CampaignController]
})
export class AdGroupModule {}
