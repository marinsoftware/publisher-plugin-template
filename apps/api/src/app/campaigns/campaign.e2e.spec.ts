import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CampaignModule } from './campaign.module';
import { of } from 'rxjs';
import { WalmartCampaign } from "../models/walmart-objects";
import { PublisherApiService } from "../services/publisher_api.service";
import { PublisherUtil } from "../services/publisher_utils.service"
import { MarinResponse, MarinSingleObj } from "../models/marin-object.interface";


describe('Campaigns e2e', () => {
  let app: INestApplication;
  let walmartService: PublisherApiService;
  let publisherUtil: PublisherUtil;
  const campaignObjDummy = <WalmartCampaign>{
    "advertiserId": 1,
    "id": 1,
    "displayStatus": "running",
    "name": "compaigns",
    "startTime": "01-01-2023",
    "endTime": "01-01-2023",
    "dailyBudgetAmount": {"amount":"1212", "currency": "USD"},
    "budgetAmount": {"amount":"1212", "currency": "USD"},
    "adChannelType":"string",
    "adamId": 1212,
    "billingEvent": "string",
    "countriesOrRegions": ["string1", "string2"],
    "supplySources": ["string1", "string2"],
    "status": "active",
    "orgId": 123
  };
  const campaignSingleObjDummy = <MarinSingleObj>{
    "id": '1',
    "parentId": "1",
    "status": "ACTIVE",
    "name": "test campaigns",
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
      }
    ]
  }
  // const appleResponse = <WalmartCampaign> {
  //   "name": "comapaign",
  //   "status": "active",
  //   "orgId": 1212,
  //   "startTime": "2023-08-08",
  //   "endTime": "2023-08-14",
  //   "dailyBudgetAmount": {
  //     "amount": "250",
  //     "currency": "USD",
  //   },
  //   "adChannelType": "DISPLAY",
  //   "supplySources": ["APPSTORE_TODAY_TAB"],
  //   "budgetAmount": {
  //     "amount": "1500",
  //     "currency": "USD"
  //   },

  //  }
  const accountId: number = 1122;
  const refreshToken: string = "1122";
  const campaignId: string = "1122";
  const pagination = {totalResults: 1, startIndex: 0, itemsPerPage: 1};
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [
          CampaignModule,
        ],
    }).compile();
    app = moduleRef.createNestApplication();
    walmartService = app.get<PublisherApiService>(PublisherApiService);
    publisherUtil = app.get<PublisherUtil>(PublisherUtil);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it(`/Get All Campaigns`, async() => {
    jest.spyOn(publisherUtil, 'refreshAccessToken').mockImplementation(
      async () => Promise.resolve({"access_token": "{token}"})
    );
    jest.spyOn(walmartService, 'makeHttpCall').mockImplementation(
      async () => Promise.resolve({data: [campaignObjDummy], pagination:pagination, error: null})
    );
    const response = await request(app.getHttpServer())
    .get('/campaigns')
    .query({ accountId: accountId, token: refreshToken })
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(200)
    expect(response.body)
  });

  it(`/Get A Campaigns`, async() => {
    jest.spyOn(publisherUtil, 'refreshAccessToken').mockImplementation(
      async () => Promise.resolve({"access_token": "{token}"})
    );
    jest.spyOn(walmartService, 'makeHttpCall').mockImplementation(
      async () => Promise.resolve({data: campaignObjDummy, pagination: null, error: null})
    );
    const response = await request(app.getHttpServer())
    .get('/campaigns')
    .query({ accountId: accountId, token: refreshToken ,campaignId: campaignId})
    .set('Accept', 'application/json')
    expect(response.statusCode).toBe(200)
    expect(response.body)
  });

  it(`/Post Campaign`, async() => {
    jest.spyOn(publisherUtil, 'refreshAccessToken').mockImplementation(
      async () => Promise.resolve({"access_token": "{token}"})
    );
    jest.spyOn(walmartService, 'makeHttpCall').mockImplementation(
      async () => Promise.resolve({data: campaignObjDummy})
    );
    const response = await request(app.getHttpServer())
    .post('/campaigns')
    .query({ accountId: accountId, refreshToken: refreshToken})
    .send([campaignSingleObjDummy])
    .set('Accept', 'application/json')
    expect(200)
    expect(response.body)
  });

  it(`/Put Campaign`, async() => {
    jest.spyOn(publisherUtil, 'refreshAccessToken').mockImplementation(
      async () => Promise.resolve({"access_token": "{token}"})
    );
     jest.spyOn(walmartService, 'makeHttpCall').mockImplementation(
      async () => Promise.resolve({campaignObjDummy})
    );
    const response = await request(app.getHttpServer())
    .put('/campaigns')
    .send([campaignSingleObjDummy])
    .query({ accountId: accountId, refreshToken: refreshToken})
    .set('Accept', 'application/json')
    expect(200)
    expect(response.body)
  });

});
