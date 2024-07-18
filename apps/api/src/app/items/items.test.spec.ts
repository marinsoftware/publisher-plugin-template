import { Test, TestingModule } from '@nestjs/testing';
import { AdItemsController } from './ad-items.controller';
import { PublisherApiService } from "../services/publisher_api.service";
import { WalmartAdItem } from "../models/walmart-objects";
import { MarinSingleObj } from "../models/marin-object.interface";
import { transformMarinAdItems, transformWalmartAdItems } from "../transformers/object-transformer";
import { PublisherUtil } from "../services/publisher_utils.service";
import { AdItemsModule } from "./ad-items.module";
import { CampaignController } from "../campaigns/campaign.controller";
import { AdGroupsController } from "../groups/ad-groups.controller";

describe('Ad Items', () => {
  let adItemController: AdItemsController;
  let walmartService: PublisherApiService;
  let campaignId: number;
  let walmartAdItemObj, groupSingleObj;
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
    walmartService = app.get<PublisherApiService>(PublisherApiService);
    publisherUtil = app.get<PublisherUtil>(PublisherUtil);
    campaignController = app.get<CampaignController>(CampaignController);
    adGroupsController = app.get<AdGroupsController>(AdGroupsController);
    campaignId = 1;
    walmartAdItemObj = <WalmartAdItem> {
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
			let response = transformWalmartAdItems([walmartAdItemObj]);
			expect(response).toBeInstanceOf(Array)
			expect(response[0]).toHaveProperty('name');
			expect(response[0]).toHaveProperty('properties');

      walmartAdItemObj.status = 'enabled';
      response = transformWalmartAdItems([walmartAdItemObj]);
			expect(response).toBeInstanceOf(Array)
      expect(response[0]).toHaveProperty('name');
			expect(response[0]).toHaveProperty('properties');

      walmartAdItemObj.status = 'paused';
      response = transformWalmartAdItems([walmartAdItemObj]);
			expect(response).toBeInstanceOf(Array)
      expect(response[0]).toHaveProperty('name');
			expect(response[0]).toHaveProperty('properties');

      walmartAdItemObj.status = 'deleted';
      response = transformWalmartAdItems([walmartAdItemObj]);
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

		// it('successfully transform walmart aditem post object', () => {
		// 	const response = transformMarinAdItems([groupSingleObj]);
		// 	expect(response).toBeInstanceOf(Array)
		// 	expect(response[0]).toHaveProperty('adGroupId');
		// 	expect(response[0]).toHaveProperty('name');
		// 	expect(response[0]).toHaveProperty('status');
    // });

		// it('successfully create aditem objects post', done => {
		// 	jest.spyOn(walmartService, 'makeApiCall').mockImplementation(
		// 		() => { return of([walmartAdItemObj]) }
		// 	);
		// 	walmartService.createObjects('aditem', [walmartAdItemObj])
		// 	.subscribe(
		// 			(res) => {
		// 				expect(res).toBeInstanceOf(Array)
		// 				expect(res[0]).toHaveProperty('adGroupId', 1);
		// 				expect(res[0]).toHaveProperty('campaignId', 1);
		// 				expect(res[0]).toHaveProperty('itemId', "string");
		// 				expect(res[0]).toHaveProperty('bid', 1);
		// 			done();
		// 			}
		// 	);
    // });

    // it('aditem post response translation on success', done => {
		// 	const response: Observable<any> = of([{"code": 'success', "details": "dummy details", "adItemId":"123"}]);
		// 	walmartService.responseTranslation(response, [groupSingleObj], 'adItem')
		// 	.subscribe(
		// 		(res) => {
		// 			expect(res).toHaveProperty('requestResult', 'SUCCESS');
		// 			done();
		// 		}
		// 	);
    // });

    // it('aditem post response translation on failure', done => {
		// 	const response: Observable<any> = of([{"code": 'failure', "details": "dummy details", "adItemId":"123"}]);
		// 	walmartService.responseTranslation(response, [groupSingleObj], 'adItem')
		// 	.subscribe(
		// 		(res) => {
		// 			expect(res).toHaveProperty('requestResult', 'Error');
		// 			done();
		// 		}
		// 	);
    // });

    // it('aditem post response translation on partial success', done => {
		// 	const response: Observable<any> = of([{"code": 'failure', "details": "dummy details", "aditem":"123"}, {"code": 'success', "details": "dummy details", "aditem":"1234"}]);
		// 	walmartService.responseTranslation(response, [groupSingleObj, groupSingleObj], 'aditem')
		// 	.subscribe(
		// 		(res) => {
		// 			expect(res).toHaveProperty('requestResult', 'PARTIAL-SUCCESS');
		// 			done();
		// 		}
		// 	);
    // });

    // it('successfully transform walmart aditem delete object', () => {
    //   groupSingleObj.status = "INACTIVE";
    //   groupSingleObj.properties[0].name = "image_url";
		// 	let response = transformMarinAdItems([groupSingleObj]);
		// 	expect(response).toBeInstanceOf(Array);
		// 	expect(response[0]).toHaveProperty('adGroupId');
		// 	expect(response[0]).toHaveProperty('adItemId');
		// 	expect(response[0]).toHaveProperty('name');
		// 	expect(response[0]).toHaveProperty('status');

    //   groupSingleObj.properties[0].name = "destination_url";
		// 	response = transformMarinAdItems([groupSingleObj]);
    //   expect(response).toBeInstanceOf(Array);

    //   groupSingleObj.properties[0].name = "review_status";
		// 	response = transformMarinAdItems([groupSingleObj]);
    //   expect(response).toBeInstanceOf(Array);

    //   groupSingleObj.properties[0].name = "campaignId";
		// 	response = transformMarinAdItems([groupSingleObj]);
    //   expect(response).toBeInstanceOf(Array);
    // });

  });
});
