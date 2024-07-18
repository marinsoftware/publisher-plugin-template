import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AdItemsModule } from './ad-items.module';
import { PublisherApiService } from "../services/publisher_api.service";
import { MarinSingleObj } from "../models/marin-object.interface";
import { PublisherUtil } from "../services/publisher_utils.service";
import { CampaignController } from "../campaigns/campaign.controller";
import { AdGroupsController } from "../groups/ad-groups.controller";
import { WalmartAdItem , WalmartAdGroup} from "../models/walmart-objects";


describe('Items e2e', () => {
  let app: INestApplication;
  let walmartService: PublisherApiService;
  let publisherUtil: PublisherUtil;
  let campaignController: CampaignController;
  let adGroupsController: AdGroupsController;
  const accountId: number = 1122;
  const refreshToken: string = "1122";
  const pagination = {totalResults: 1, startIndex: 0, itemsPerPage: 1};

  const singleObjDummy = <MarinSingleObj>{
    "parentId": "1",
    "id": "1",
    "status": "ACTIVE",
    "name": "dummy",
    "properties": [{ "name": "string", "value": "string" }],
  };
  const publisherItem = <WalmartAdItem>{
    adGroupId: 1,
    id: '1',
    status: 'active',
    name: 'dummy ad',
    campaignId: 123,
  }
  const publishergroup = <WalmartAdGroup>{
    id: 1,
    campaignId: 123,
    name: "dummy",
    displayStatus: "ACTIVE",
    status: "ACTIVE",
    defaultBidAmount: {"amount":"1212", "currency": "USD"},
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [
          AdItemsModule,
        ],
    }).compile();
    app = moduleRef.createNestApplication();
    walmartService = app.get<PublisherApiService>(PublisherApiService);
    publisherUtil = app.get<PublisherUtil>(PublisherUtil);
    campaignController = app.get<CampaignController>(CampaignController);
    adGroupsController = app.get<AdGroupsController>(AdGroupsController);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it(`/Get All ads`, async() => {
    jest.spyOn(publisherUtil, 'refreshAccessToken').mockImplementation(
      async () => Promise.resolve({"access_token": "{token}"})
    );
    jest.spyOn(campaignController, 'get').mockImplementation(
      async () => Promise.resolve([singleObjDummy])
    );
    jest.spyOn(adGroupsController, 'get').mockImplementation(
      async () => Promise.resolve([singleObjDummy])
    );
    jest.spyOn(walmartService, 'makeHttpCall').mockImplementation(
      async () => Promise.resolve({data: [publisherItem], pagination: pagination, error: null})
    );
    const response = await request(app.getHttpServer())
    .get('/ads')
    .query({ accountId: accountId, refreshToken: refreshToken})
    .set('Accept', 'application/json')
    expect(200)
    expect(response.body)
  });


  it(`/Post Ad item`, async() => {
    jest.spyOn(publisherUtil, 'refreshAccessToken').mockImplementation(
      async () => Promise.resolve({"access_token": "{token}"})
    );
    jest.spyOn(campaignController, 'get').mockImplementation(
      async () => Promise.resolve([singleObjDummy])
    );
    jest.spyOn(walmartService, 'getPublisherAdGroups').mockImplementation(
      async () => Promise.resolve({data: [publishergroup], pagination: pagination, error: null})
    );
    jest.spyOn(walmartService, 'makeHttpCall').mockImplementation(
      async () => Promise.resolve({data: publisherItem})
    );
    const response = await request(app.getHttpServer())
    .post('/ads')
    .query({ accountId: accountId, token: refreshToken })
    .send([singleObjDummy])
    .set('Accept', 'application/json')
    expect(200)
    expect(response.body)
  });

  it(`/Edit Ads`, async() => {
    jest.spyOn(publisherUtil, 'refreshAccessToken').mockImplementation(
      async () => Promise.resolve({"access_token": "{token}"})
    );
    jest.spyOn(campaignController, 'get').mockImplementation(
      async () => Promise.resolve([singleObjDummy])
    );
    jest.spyOn(walmartService, 'getPublisherAdGroups').mockImplementation(
      async () => Promise.resolve({data: [publishergroup], pagination: pagination, error: null})
    );
    jest.spyOn(walmartService, 'makeHttpCall').mockImplementation(
      async () => Promise.resolve({data: publisherItem})
    );
    const response = await request(app.getHttpServer())
    .put('/ads')
    .send([singleObjDummy])
    .set('Accept', 'application/json')
    expect(200)
    expect(response.body)
  });

  // it(`/Delete Ads`, async() => {
  //   const res = <MarinResponse> {
  //       requestResult: "string",
  //       objects: [{status: "string", details: "string", object: singleObjDummy}]
  //     }
  //   jest.spyOn(walmartService, 'makeHttpCall').mockImplementation(
  //     async () => Promise.resolve(res)
  //   );
  //   const response = await request(app.getHttpServer())
  //   .put('/ads/delete')
  //   .send([singleObjDummy])
  //   .set('Accept', 'application/json')
  //   expect(200)
  //   expect(response.body)
  // });

//   it(`/Post AdGroup`, async() => {
//     const res = <MarinResponse> {
//         requestResult: "string",
//         objects: [{status: "string", details: "string", object: singleObjDummy}]
//       }
//     jest.spyOn(walmartService, 'makeApiCall').mockImplementation(
//         () => { return of(res) }
//     );
//     const response = await request(app.getHttpServer())
//     .post('/groups')
//     .send([singleObjDummy])
//     .set('Accept', 'application/json')
//     expect(200)
//     expect(response.body)
//   });

//   it(`/Put AdGroups`, async() => {
//     const res = <MarinResponse> {
//         requestResult: "string",
//         objects: [{status: "string", details: "string", object: singleObjDummy}]
//       }
//     jest.spyOn(walmartService, 'makeApiCall').mockImplementation(
//         () => { return of(res) }
//     );
//     const response = await request(app.getHttpServer())
//     .put('/groups')
//     .send([singleObjDummy])
//     .set('Accept', 'application/json')
//     expect(200)
//     expect(response.body)
//   });
});
