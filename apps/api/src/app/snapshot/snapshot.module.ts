import { Module, Logger } from '@nestjs/common';
import { PublisherApiService } from "../services/publisher_api.service";
import { HttpModule } from "@nestjs/axios";
import { SnapshotController } from "./snapshot.controller";
import { SnapshotService } from './snapshot.service';
import { ControllersService } from '../services/controllers.service';
import { PublisherUtil } from "../services/publisher_utils.service";
import { AdItemsController } from "../items/ad-items.controller";
import { CampaignController } from "../campaigns/campaign.controller"
import { AdGroupsController } from "../groups/ad-groups.controller";

@Module({
  imports: [HttpModule],
  controllers: [SnapshotController],
  providers: [SnapshotService, PublisherApiService, ControllersService, PublisherUtil, AdItemsController, Logger, CampaignController, AdGroupsController]
})
export class SnapshotModuleModule {}
