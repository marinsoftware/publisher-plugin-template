import { Module, Logger } from '@nestjs/common';
import { PublisherApiService } from "../services/publisher_api.service";
import { PublisherUtil } from "../services/publisher_utils.service"
import { HttpModule } from "@nestjs/axios";
import { AdItemsController } from "./ad-items.controller";
import { CampaignController } from "../campaigns/campaign.controller"
import { AdGroupsController } from "../groups/ad-groups.controller";

@Module({
  imports: [HttpModule],
  controllers: [AdItemsController],
  providers: [PublisherApiService, PublisherUtil, Logger, CampaignController, AdGroupsController]
})
export class AdItemsModule {}
