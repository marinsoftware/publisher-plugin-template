import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { HealthModule } from './health.module';
import {HealthService} from './health.service';

describe('Publishers', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET L1 Health`, async() => {
    const response = await request(app.getHttpServer()).get('/admin/status/marin-amazon-api-pg-service/L1').set('Accept', 'application/json')
    expect(200)
    expect(response.body).toHaveProperty('marin-AMAZON_PUBGATEWAY-api-service');
  }, 800000000);

  it(`/GET L2 Health`, async() => {
    const response = await request(app.getHttpServer()).get('/admin/status/marin-amazon-api-pg-service/L2').set('Accept', 'application/json')
    expect(200)
    expect(response.body).toHaveProperty('marin-AMAZON_PUBGATEWAY-api-service');
  }, 800000000);

  it(`/GET L1 + L2 Health`, async() => {
    const response = await request(app.getHttpServer()).get('/admin/status/marin-amazon-api-pg-service/L2').set('Accept', 'application/json')
    expect(200)
    expect(response.body).toHaveProperty('marin-AMAZON_PUBGATEWAY-api-service');
  }, 800000000);
  afterAll(async () => {
    await app.close();
  });
});
