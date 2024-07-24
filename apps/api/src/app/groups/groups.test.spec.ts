import { Test, TestingModule } from '@nestjs/testing';
import { AdGroupsController } from './ad-groups.controller';
import { PublisherApiService } from '../services/publisher_api.service';
import { PublishersAdGroup } from "../models/publisher-objects";
import { MarinSingleObj } from "../models/marin-object.interface";
import { transformMarinAdgroup, transformPublisherAdGroup } from "../transformers/object-transformer";
import { AdGroupModule } from './ad-group.module';


describe('AdGroupsController', () => {
  let groupController: AdGroupsController;
  let publisherService: PublisherApiService;
  let advertiserId: number;
  let campaignId: number;
  let publisherAdGroupObj, groupSingleObj;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
		AdGroupModule,
	]
    })
    .compile();

    groupController = app.get<AdGroupsController>(AdGroupsController);
    publisherService = app.get<PublisherApiService>(PublisherApiService);
    advertiserId = 1;
    campaignId = 1;
    publisherAdGroupObj = <PublishersAdGroup> {
		id: 1,
		campaignId: 1,
		name: "string",
		displayStatus: "Active",
		status: "ACTIVE",
		defaultBidAmount: {"amount": "500"}
    }
	groupSingleObj = <MarinSingleObj> {
		"parentId": "string",
		"id": "string",
		"status": "ACTIVE",
		"name": "string",
		"properties": [{ "name": "string", "value": "string" }]
	}
  });

  describe('Groups', () => {
    it('controller to be defined', () => {
      expect(groupController).toBeDefined();
    });

    it ('method get to be defined', () =>{
      expect(groupController.get).toBeDefined();
    });

    it ('method create to be defined', () =>{
      expect(groupController.create).toBeDefined();
    });

    it ('method edit to be defined', () =>{
      expect(groupController.edit).toBeDefined();
    });
	
    it('successfully transform apple group object list', () => {
		let response = transformPublisherAdGroup([publisherAdGroupObj], 0);
		expect(response).toBeInstanceOf(Array)
		expect(response[0]).toHaveProperty('name');
    });

  });
});
