/* eslint-disable no-unused-labels */
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CatsModule } from './cats.module';
import { CatsService } from './cats.service';
import { HealthModule } from '../health/health.module';

xdescribe('Cats', () => {
  let app: INestApplication;
  const catsService = {
    getAll: () => ['test'],
    create: () => ['test'],
    findCatById: () => [{
      id: 'test',
    }],
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CatsModule, HealthModule],
    })
      .overrideProvider(CatsService)
      .useValue(catsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET cats`, () => {
    return request(app.getHttpServer())
      .get('/cats')
      .expect(200)
      .expect(catsService.getAll());
  });
  it(`/GET :id`, () => {
    return request(app.getHttpServer())
      .get('/cats/123')
      .expect(200)
      .expect(catsService.findCatById());
  });

  afterAll(async () => {
    await app.close();
  });
});
