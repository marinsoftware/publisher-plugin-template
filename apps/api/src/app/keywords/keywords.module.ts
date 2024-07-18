import { Module, Logger } from '@nestjs/common';
import { KeywordController } from "./keywords.controller";
import { CampaignController } from "../campaigns/campaign.controller"
import { HttpModule } from "@nestjs/axios";
import { AdGroupsController } from "../groups/ad-groups.controller";
import { PublisherApiService } from "../services/publisher_api.service";
import { PublisherUtil } from "../services/publisher_utils.service"


@Module({
  imports: [HttpModule],
  controllers: [KeywordController],
  providers: [PublisherApiService, PublisherUtil, Logger, CampaignController, AdGroupsController]
})
export class KeywordModule {}
