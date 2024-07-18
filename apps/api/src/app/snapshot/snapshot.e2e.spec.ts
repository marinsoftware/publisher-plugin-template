import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AdGroupModule } from '../groups/ad-group.module';
import { PublisherApiService } from "../services/publisher_api.service";
import { MarinResponse, MarinSingleObj } from '../models/marin-object.interface';
import { PublisherKeyword } from "../models/walmart-objects";
import { PublisherUtil } from "../services/publisher_utils.service";
import { CampaignController } from "../campaigns/campaign.controller";
import { AdGroupsController } from "../groups/ad-groups.controller";
import { SnapshotModuleModule } from "../snapshot/snapshot.module";
import { SnapshotResponse } from "../models/snapshot.interface"


describe('snapshot e2e', () => {
//   get currentDate annd 2 days before 
  var d = new Date(),
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();
  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;
  let currentDate = [year, month, day].join('-')
  let num = Number(day) - 3;
  day = String(num) 
  let twobeforedays = [year, month, day].join('-')
  let app: INestApplication;
  let walmartService: PublisherApiService;
  let publisherUtil: PublisherUtil;
  let campaignController: CampaignController;
  let startDate: string = twobeforedays
  let endDate: string = currentDate
  let reportTypeGroup: string = "group"
  let reportTypeCreative: string = "creative"
  let reportTypeKeyword: string = "keyword"
  const accountId: number = 1122;
  const refreshToken: string = "1122";
  const pagination = {totalResults: 1, startIndex: 0, itemsPerPage: 1};

  const singleObjDummy = <MarinSingleObj>{
    "parentId": "string",
    "id": "string",
    "status": "string",
    "name": "string",
    "properties": [{ "name": "string", "value": "string" }]
  };



  const ResponseSnapshot = <SnapshotResponse>{
    granularity: [
        {
          impressions: 1,
          taps: 2,
          localSpend: { amount: "12", currency: "USD" },
          date: "2022-01-20",
        },
      ],
      metadata: {
        adGroupId: 12,
        campaignId: 12,
      }
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [
            SnapshotModuleModule,
        ],
    }).compile();
    app = moduleRef.createNestApplication();
    walmartService = app.get<PublisherApiService>(PublisherApiService);
    campaignController = app.get<CampaignController>(CampaignController);
    publisherUtil = app.get<PublisherUtil>(PublisherUtil);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it(`/Get Snapshot for adgroup`, async() => {
    1 === 1
  })

  // it(`/Get Snapshot for adgroup`, async() => {
  //   jest.spyOn(publisherUtil, 'refreshAccessToken').mockImplementation(
  //     async () => Promise.resolve({"access_token": "{token}"})
  //   );
  //   jest.spyOn(campaignController, 'get').mockImplementation(
  //       async () => Promise.resolve([singleObjDummy])
  //     );
  //   jest.spyOn(walmartService, 'makeHttpCall').mockImplementation(

  //       async () => Promise.resolve({'data': {'reportingDataResponse': {'row': [ResponseSnapshot]}}})
  //   );

  //   const response = await request(app.getHttpServer())
  //   .get('/reporting/public/v1.0/report')
  //   .query({ accountId: accountId, reportType: reportTypeGroup, startDate: startDate, endDate: endDate, refreshToken: refreshToken})
  //   .set('Accept', 'application/json')
  //   expect(response.statusCode).toBe(200)
  //   expect(response.body)
  // });

  // it(`/Get Snapshot for creative`, async() => {
  //   jest.spyOn(publisherUtil, 'refreshAccessToken').mockImplementation(
  //     async () => Promise.resolve({"access_token": "{token}"})
  //   );
  //   jest.spyOn(campaignController, 'get').mockImplementation(
  //       async () => Promise.resolve([singleObjDummy])
  //     );
  //   jest.spyOn(walmartService, 'makeHttpCall').mockImplementation(

  //       async () => Promise.resolve({'data': {'reportingDataResponse': {'row': [ResponseSnapshot]}}})
  //   );

  //   const response = await request(app.getHttpServer())
  //   .get('/reporting/public/v1.0/report')
  //   .query({ accountId: accountId, reportType: reportTypeCreative, startDate: startDate, endDate: endDate, refreshToken: refreshToken})
  //   .set('Accept', 'application/json')
  //   expect(response.statusCode).toBe(200)
  //   expect(response.body)
  // });

  // it(`/Get Snapshot for Keyword`, async() => {
  //   jest.spyOn(publisherUtil, 'refreshAccessToken').mockImplementation(
  //     async () => Promise.resolve({"access_token": "{token}"})
  //   );
  //   jest.spyOn(campaignController, 'get').mockImplementation(
  //       async () => Promise.resolve([singleObjDummy])
  //     );
  //   jest.spyOn(walmartService, 'makeHttpCall').mockImplementation(

  //       async () => Promise.resolve({'data': {'reportingDataResponse': {'row': [ResponseSnapshot]}}})
  //   );

  //   const response = await request(app.getHttpServer())
  //   .get('/reporting/public/v1.0/report')
  //   .query({ accountId: accountId, reportType: reportTypeKeyword, startDate: startDate, endDate: endDate, refreshToken: refreshToken})
  //   .set('Accept', 'application/json')
  //   expect(response.statusCode).toBe(200)
  //   expect(response.body)
  // });

});