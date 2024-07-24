import { Test, TestingModule } from '@nestjs/testing';
import { AdItemsController } from './ad-items.controller';
import { PublisherApiService } from "../services/publisher_api.service";
import { PublisherAdItem } from "../models/publisher-objects";
import { MarinSingleObj } from "../models/marin-object.interface";
import { transformMarinAdItems, transformPublisherAdItems } from "../transformers/object-transformer";
import { PublisherUtil } from "../services/publisher_utils.service";
import { AdItemsModule } from "./ad-items.module";
import { CampaignController } from "../campaigns/campaign.controller";
import { AdGroupsController } from "../groups/ad-groups.controller";

describe('Ad Items', () => {
  let adItemController: AdItemsController;
  let publiherService: PublisherApiService;
  let campaignId: number;
  let publisherAdItemObj, groupSingleObj;
  let publisherUtil: PublisherUtil;
  let campaignController: CampaignController;
  let adGroupsController: AdGroupsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        AdItemsModule,
      ]
    })
    .compile();

    adItemController = app.get<AdItemsController>(AdItemsController);
    publiherService = app.get<PublisherApiService>(PublisherApiService);
    publisherUtil = app.get<PublisherUtil>(PublisherUtil);
    campaignController = app.get<CampaignController>(CampaignController);
    adGroupsController = app.get<AdGroupsController>(AdGroupsController);
    campaignId = 1;
    publisherAdItemObj = <PublisherAdItem> {
      campaignId: 1,
      adGroupId: 1,
      itemId: "string",
      id: "string",
      bid: 1,
      status: "string",
      name: "string"
    }
    groupSingleObj = <MarinSingleObj> {
        "parentId": "string",
        "id": "string",
        "status": "COMPLETED",
        "name": "string",
        "properties": [{ "name": "sku", "value": "string" }]
    }
  });

  describe('Items', () => {
    it('controller to be defined', () => {
      expect(adItemController).toBeDefined();
    });

    it ('method get to be defined', () =>{
      expect(adItemController.get).toBeDefined();
    });

    it ('method create to be defined', () =>{
      expect(adItemController.create).toBeDefined();
    });

    it ('method edit to be defined', () =>{
      expect(adItemController.edit).toBeDefined();
    });

		it('successfully transform publisher aditem object list', () => {
			let response = transformPublisherAdItems([publisherAdItemObj]);
			expect(response).toBeInstanceOf(Array)
			expect(response[0]).toHaveProperty('name');
			expect(response[0]).toHaveProperty('properties');

      publisherAdItemObj.status = 'enabled';
      response = transformPublisherAdItems([publisherAdItemObj]);
			expect(response).toBeInstanceOf(Array)
      expect(response[0]).toHaveProperty('name');
			expect(response[0]).toHaveProperty('properties');

      publisherAdItemObj.status = 'paused';
      response = transformPublisherAdItems([publisherAdItemObj]);
			expect(response).toBeInstanceOf(Array)
      expect(response[0]).toHaveProperty('name');
			expect(response[0]).toHaveProperty('properties');

      publisherAdItemObj.status = 'deleted';
      response = transformPublisherAdItems([publisherAdItemObj]);
			expect(response).toBeInstanceOf(Array)
      expect(response[0]).toHaveProperty('name');
			expect(response[0]).toHaveProperty('properties');

    });

    it('successfully transform aditem put object', () => {
      groupSingleObj.status = "PAUSED";
			let response = transformMarinAdItems([groupSingleObj], 'put');
			expect(response).toBeInstanceOf(Array)
			expect(response[0]).toHaveProperty('id');
			expect(response[0]).toHaveProperty('status');

      groupSingleObj.status = "ACTIVE";
			response = transformMarinAdItems([groupSingleObj], 'put');
			expect(response).toBeInstanceOf(Array)
			expect(response[0]).toHaveProperty('id');
			expect(response[0]).toHaveProperty('status');

    });

    it('successfully transform aditem post object', () => {
      groupSingleObj.status = "PAUSED";
			let response = transformMarinAdItems([groupSingleObj], 'post');
			expect(response).toBeInstanceOf(Array)
			expect(response[0]).toHaveProperty('id');
			expect(response[0]).toHaveProperty('status');

      groupSingleObj.status = "ACTIVE";
			response = transformMarinAdItems([groupSingleObj], 'post');
			expect(response).toBeInstanceOf(Array)
			expect(response[0]).toHaveProperty('id');
			expect(response[0]).toHaveProperty('status');

      groupSingleObj.status = "DELETED";
			response = transformMarinAdItems([groupSingleObj], 'post');
			expect(response).toBeInstanceOf(Array)
			expect(response[0]).toHaveProperty('id');
			expect(response[0]).toHaveProperty('status');
      
    });

  });
});
