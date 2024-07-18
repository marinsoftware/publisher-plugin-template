import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AdGroupModule } from './ad-group.module';
import { PublisherApiService } from "../services/publisher_api.service";
import { MarinSingleObj } from '../models/marin-object.interface';
import { WalmartAdGroup } from "../models/walmart-objects";
import { PublisherUtil } from "../services/publisher_utils.service"
import { CampaignController } from "../campaigns/campaign.controller"

describe('Ad Groups e2e', () => {
  let app: INestApplication;
  let walmartService: PublisherApiService;
  let publisherUtil: PublisherUtil;
  let campaignController: CampaignController;
  const accountId: number = 1122;
  const campaignId: number = 1122;
  const adgroupId: number = 1122;
  const refreshToken: string = "1122";
  const offset: number = 1;
  const pagination = {totalResults: 1, startIndex: 0, itemsPerPage: 1};
  const adGroupObjDummy = <WalmartAdGroup>{
    "id": 1,
    "campaignId": 1,
    "name": "new",
    "adGroupId": 1,
    "displayStatus": 'Active',
    "defaultBidAmount": {"amount":"1212", "currency": "USD"},
  };

  const singleObjDummy = <MarinSingleObj>{
    "parentId": "122",
    "id": "1212",
    "status": "ACTIVE",
    "name": "dummy",
    "properties": [
      {
        "name": "start_date", "value": "13-07-2023"
      },
      {
        "name": "end_date", "value": "13-08-2023"
      },
      {
        "name": "daily_budget", "value": "500"
      },
      {
        "name": "total_budget", "value": "1000"
      },
      {
        "name": "publisher_campaign_type", "value": "dummy"
      },
      {
        "name": "targeting_type", "value": ["dummy"]
      },
    ]
  };


  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [
          AdGroupModule,
        ],
    }).compile();
    app = moduleRef.createNestApplication();
    walmartService = app.get<PublisherApiService>(PublisherApiService);
    publisherUtil = app.get<PublisherUtil>(PublisherUtil);
    campaignController = app.get<CampaignController>(CampaignController);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it(`/Get All AdGroups`, async() => {
    jest.spyOn(publisherUtil, 'refreshAccessToken').mockImplementation(
      async () => Promise.resolve({"access_token": "{token}"})
    );
    jest.spyOn(campaignController, 'get').mockImplementation(
      async () => Promise.resolve([singleObjDummy])
    );
    jest.spyOn(walmartService, 'makeHttpCall').mockImplementation(
      async () => Promise.resolve({data: [adGroupObjDummy], pagination: pagination, error: null})
    );
    const response = await request(app.getHttpServer())
    .get('/groups')
    .query({ accountId: accountId, campaignId:campaignId, refreshToken: refreshToken, offset: offset })
    .set('Accept', 'application/json')
    expect(200)
    expect(response.body)
  });


  it(`/Get AdGroups of compaign`, async() => {
    jest.spyOn(publisherUtil, 'refreshAccessToken').mockImplementation(
      async () => Promise.resolve({"access_token": "{token}"})
    );
    jest.spyOn(walmartService, 'makeHttpCall').mockImplementation(
      async () => Promise.resolve({data: [adGroupObjDummy], pagination: pagination, error: null})
    );
    const response = await request(app.getHttpServer())
    .get('/groups')
    .query({ accountId: accountId, refreshToken: refreshToken, campaignId:campaignId, offset: offset })
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(200)
    expect(response.body)
  });

  it(`/Get AdGroups of compaign by adgroupId`, async() => {
    jest.spyOn(publisherUtil, 'refreshAccessToken').mockImplementation(
      async () => Promise.resolve({"access_token": "{token}"})
    );
    jest.spyOn(walmartService, 'makeHttpCall').mockImplementation(
      async () => Promise.resolve({data: adGroupObjDummy, pagination: null, error: null})
    );
    const response = await request(app.getHttpServer())
    .get('/groups')
    .query({accountId: accountId, refreshToken: refreshToken, campaignId:campaignId, adgroupId: adgroupId})
    .set('Accept', 'application/json')
    expect(200)
    expect(response.body)
  });
  

  it(`/Post AdGroup`, async() => {
    jest.spyOn(publisherUtil, 'refreshAccessToken').mockImplementation(
      async () => Promise.resolve({"access_token": "{token}"})
    );
    jest.spyOn(walmartService, 'makeHttpCall').mockImplementation(
      async () => Promise.resolve({data: adGroupObjDummy})
    );
    const response = await request(app.getHttpServer())
    .post('/groups')
    .query({ accountId: accountId, token: refreshToken })
    .send([singleObjDummy])
    .set('Accept', 'application/json')
    expect(200)
    expect(response.body)
  });

  it(`/Put AdGroups`, async() => {
    jest.spyOn(publisherUtil, 'refreshAccessToken').mockImplementation(
      async () => Promise.resolve({"access_token": "{token}"})
    );
    jest.spyOn(walmartService, 'makeHttpCall').mockImplementation(
      async () => Promise.resolve({data: adGroupObjDummy})
    );
    const response = await request(app.getHttpServer())
    .put('/groups')
    .send([singleObjDummy])
    .set('Accept', 'application/json')
    expect(200)
    expect(response.body)
  });
});
