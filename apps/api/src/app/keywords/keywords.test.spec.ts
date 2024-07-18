import { Test, TestingModule } from '@nestjs/testing';
import { KeywordController } from './keywords.controller';
import { PublisherApiService } from "../services/publisher_api.service";
import { PublisherAdItem } from "../models/publisher-objects";
import { MarinSingleObj } from "../models/marin-object.interface";
import { transformPublisherkeywords, transformMarinKeywords } from "../transformers/object-transformer";
import { PublisherUtil } from "../services/publisher_utils.service";
import { KeywordModule } from "./keywords.module";
import { CampaignController } from "../campaigns/campaign.controller";
import { AdGroupsController } from "../groups/ad-groups.controller";

describe('keywords', () => {
  let keywordController: KeywordController;
  let publisherService: PublisherApiService;
  let campaignId: number;
  let publisherkeywordObj, groupSingleObj;
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
    publisherService = app.get<PublisherApiService>(PublisherApiService);
    publisherUtil = app.get<PublisherUtil>(PublisherUtil);
    campaignController = app.get<CampaignController>(CampaignController);
    adGroupsController = app.get<AdGroupsController>(AdGroupsController);
    campaignId = 1;
    publisherkeywordObj = <PublisherAdItem> {
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
        let response = transformPublisherkeywords([publisherkeywordObj], 0);
        expect(response).toBeInstanceOf(Array)
        expect(response[0]).toHaveProperty('name');
        expect(response[0]).toHaveProperty('properties');

        publisherkeywordObj.status = 'paused';
        response = transformPublisherkeywords([publisherkeywordObj] , 0);
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

  });
});
