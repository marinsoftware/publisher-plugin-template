import { Test, TestingModule } from '@nestjs/testing';
import { KeywordController } from './keywords.controller';
import { PublisherApiService } from "../services/publisher_api.service";
import { WalmartAdItem } from "../models/walmart-objects";
import { MarinSingleObj } from "../models/marin-object.interface";
import { transformPublisherkeywords, transformMarinKeywords } from "../transformers/object-transformer";
import { PublisherUtil } from "../services/publisher_utils.service";
import { KeywordModule } from "./keywords.module";
import { CampaignController } from "../campaigns/campaign.controller";
import { AdGroupsController } from "../groups/ad-groups.controller";

describe('keywords', () => {
  let keywordController: KeywordController;
  let walmartService: PublisherApiService;
  let campaignId: number;
  let walmartkeywordObj, groupSingleObj;
  let publisherUtil: PublisherUtil;
  let campaignController: CampaignController;
  let adGroupsController: AdGroupsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        KeywordModule,
      ]
    })
    .compile();

    keywordController = app.get<KeywordController>(KeywordController);
    walmartService = app.get<PublisherApiService>(PublisherApiService);
    publisherUtil = app.get<PublisherUtil>(PublisherUtil);
    campaignController = app.get<CampaignController>(CampaignController);
    adGroupsController = app.get<AdGroupsController>(AdGroupsController);
    campaignId = 1;
    walmartkeywordObj = <WalmartAdItem> {
      campaignId: 1,
      adGroupId: 1,
      itemId: "string",
      id: "string",
      bid: 1,
      status: "ACTIVE",
      name: "string"
    }
    groupSingleObj = <MarinSingleObj> {
        "parentId": "1",
        "id": "1",
        "status": "COMPLETED",
        "name": "dummy",
        "properties": [{ "name": "sku", "value": "123" }]
    }
  });

  describe('keywords', () => {
    it('controller to be defined', () => {
      expect(keywordController).toBeDefined();
    });

    it ('method get to be defined', () =>{
      expect(keywordController.get).toBeDefined();
    });

    it ('method create to be defined', () =>{
      expect(keywordController.create).toBeDefined();
    });

    it ('method edit to be defined', () =>{
      expect(keywordController.edit).toBeDefined();
    });

    // it ('method delete to be defined', () =>{
    //   expect(keywordController.delete).toBeDefined();
    // });

	it('successfully transform publisher keyword object list', () => {
        let response = transformPublisherkeywords([walmartkeywordObj], 0);
        expect(response).toBeInstanceOf(Array)
        expect(response[0]).toHaveProperty('name');
        expect(response[0]).toHaveProperty('properties');

        walmartkeywordObj.status = 'paused';
        response = transformPublisherkeywords([walmartkeywordObj] , 0);
		expect(response).toBeInstanceOf(Array)
        expect(response[0]).toHaveProperty('name');
		expect(response[0]).toHaveProperty('properties');

    });

    it('successfully transform keyword put object', () => {
        groupSingleObj.status = "PAUSED";
        let response = transformMarinKeywords([groupSingleObj], 'put');
        expect(response).toBeInstanceOf(Array)
        expect(response[0]).toHaveProperty('id');
        expect(response[0]).toHaveProperty('status');

        groupSingleObj.status = "ACTIVE";
        response = transformMarinKeywords([groupSingleObj], 'put');
        expect(response).toBeInstanceOf(Array)
        expect(response[0]).toHaveProperty('id');
        expect(response[0]).toHaveProperty('status');
  
      });
  
      it('successfully transform keyword post object', () => {

        groupSingleObj.status = "PAUSED";
        groupSingleObj.properties.name = "max_cpc";
        let response = transformMarinKeywords([groupSingleObj], 'post');
        expect(response).toBeInstanceOf(Array)
        expect(response[0]).toHaveProperty('id');
        expect(response[0]).toHaveProperty('status');

        groupSingleObj.status = "ACTIVE";
        groupSingleObj.properties.name = "match_type";
        response = transformMarinKeywords([groupSingleObj], 'post');
        expect(response).toBeInstanceOf(Array)
        expect(response[0]).toHaveProperty('id');
        expect(response[0]).toHaveProperty('status');

        groupSingleObj.status = "review_status";
        groupSingleObj.properties.name = "match_type";
        response = transformMarinKeywords([groupSingleObj], 'post');
        expect(response).toBeInstanceOf(Array)
        expect(response[0]).toHaveProperty('id');
        expect(response[0]).toHaveProperty('text');

        groupSingleObj.status = "INACTIVE";
        response = transformMarinKeywords([groupSingleObj], 'post');
        expect(response).toBeInstanceOf(Array)
        expect(response[0]).toHaveProperty('id');
        expect(response[0]).toHaveProperty('text');
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
		// 		() => { return of([walmartkeywordObj]) }
		// 	);
		// 	walmartService.createObjects('aditem', [walmartkeywordObj])
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
