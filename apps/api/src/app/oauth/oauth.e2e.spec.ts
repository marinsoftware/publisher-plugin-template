import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';

import {PublisherUtil} from './utils/publisher_utils'
import { PublisherListJson } from './publishers-json';
import config from './../../../config.helper';
import * as Remote from './../oauth/utils/remote_call';
import { PublishersService } from './oauth.service';
import { PublishersController } from './oauth.controller';
import { CacheService } from '../cache/cache.service';

describe('Publishers', () => {
  let app: INestApplication;
  const code = '123qwewuxyz', accountId = "1122WU", publisher = PublisherListJson[0].publisherDefinition;
  const accountName = "Test Account", channel="Display", access_token = "dummy_token";
  const pubishersDefination = 'APPLE_PUBGATEWAY';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PublishersController],
      providers: [
        Logger, PublisherUtil,PublishersService, CacheService,
      ]
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET Publishers`, async() => {
    const response = await request(app.getHttpServer()).get('/publishers').set('Accept', 'application/json')
    expect(200)
    expect(response.body).toHaveProperty('supportedPublishers');
  });

  it(`/GET Publishers publisher definition name UPPER_SNAKE_CASE`, async() => {
    const response = await request(app.getHttpServer()).get('/publishers').set('Accept', 'application/json')
    expect(200)
    console.log("response.body", response.body)
    expect(response.body.supportedPublishers[0].publisherDefinition).toBe(pubishersDefination);
  }); 

  it(`/GET Publishers OAuth Url`, async() => {
    const response = await request(app.getHttpServer())
      .post('/oauth')
      .set('Accept', 'application/json')
      .send({state:"Active", publisher:publisher, redirect_uri:config.REDIRECT_URI})
      expect(200)
      expect(response.body).toHaveProperty('grant_url')
  }, 1800000);
  it(`/GET Publishers OAuth Invalid Url`, async() => {
    await request(app.getHttpServer())
      .post('/oauth')
      .set('Accept', 'application/json')
      .send({state:"Active", publisher:publisher, redirect_uri:'https://www.google.com'})
      expect(500)
  });
  it('/publisher account Invalid Code ', async() => {
    await request(app.getHttpServer())
      .post('/publisherAccounts')
      .set('Accept', 'application/json')
      .send({accountID: accountId, publisher: publisher, accountName: accountName, code: code, clientID: '1122WU'})
      // .expect('Content-Type', /json/)
      expect(500)
  });
  it('/publisher no account available for linked account', async() => {
    const tokenFn = jest.spyOn(PublisherUtil.prototype, 'getPublisherToken')
      .mockImplementation(async () => Promise.resolve({data: {access_token: access_token, }, message: "OK", channel:channel}))
    const remote_get = jest.spyOn(Remote, 'remote_get')
      .mockImplementation(async () => Promise.resolve(JSON.stringify({code: 0,message: "OK",request_id: "123"})))
    await request(app.getHttpServer())
      .post('/publisherAccounts')
      .set('Accept', 'application/json')
      .send({accountID: accountId, publisher: publisher, accountName: accountName, code: code, clientID: '1122WU'})
      .expect('Content-Type', /json/)
      expect(500)
      expect(tokenFn).toHaveBeenCalledTimes(1);
      expect(remote_get).toHaveBeenCalledTimes(1);
  });
  it('/publisher access token', async() => {
    const tokenFn = jest.spyOn(PublisherUtil.prototype, 'getPublisherToken')
      .mockImplementation(async () => Promise.resolve({data: {access_token: access_token,}, message: "OK", channel:channel}))
    const currencyFn = jest.spyOn(PublisherUtil.prototype, 'getAdAccountDetail')
      .mockImplementation(async () => Promise.resolve({currency: "USD"}))
    const response = await request(app.getHttpServer())
      .post('/publisherAccounts')
      .set('Accept', 'application/json')
      .send({accountID: accountId, publisher: publisher, accountName: accountName, code: code, clientID: '1122WU'})
      .expect('Content-Type', /json/)
      expect(200)
      expect(tokenFn).toHaveBeenCalledTimes(2)
      expect(currencyFn).toHaveBeenCalledTimes(1)
      expect(response.body).toHaveProperty('currency')
      expect(response.body).toHaveProperty('accountId')
      expect(response.body).toHaveProperty('clientId')
      expect(response.body).toHaveProperty('customPublisherName')
      expect(response.body).toHaveProperty('publisher')
      expect(response.body).toHaveProperty('publisherDefinitionName')
      expect(response.body).toHaveProperty('channel')
      expect(response.body).toHaveProperty('needLinkToMarinMcc')
      expect(response.body).toHaveProperty('authenticationInfo')
  });
  it('/publisher account currency has not fetched', async() => {
    const tokenFn = jest.spyOn(PublisherUtil.prototype, 'getPublisherToken')
      .mockImplementation(async () => Promise.resolve({data: {access_token: access_token}, message: "OK", channel:channel}))
    const currencyFn = jest.spyOn(PublisherUtil.prototype, 'getAdAccountDetail')
      .mockImplementation(async () => Promise.reject())
    await request(app.getHttpServer())
      .post('/publisherAccounts')
      .set('Accept', 'application/json')
      .send({accountID: accountId, publisher: publisher, accountName: accountName, code: code, clientID: '1122WU'})
      .expect('Content-Type', /json/)
      expect(500)
      expect(tokenFn).toHaveBeenCalledTimes(3)
      expect(currencyFn).toHaveBeenCalledTimes(2)
  });
  it('/publisher decode auth url', async() => {
    await request(app.getHttpServer())
    .get('/decodeOAuthUrl').set('Accept', 'application/json')
    .query({ state: 'Active', code:"&Alpha123nbc.ejd" })
    expect(200)
  });
  afterAll(async () => {
    await app.close();
  });
});
