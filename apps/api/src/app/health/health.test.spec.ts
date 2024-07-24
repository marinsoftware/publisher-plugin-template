import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { HealthModule } from './health.module';
import {HealthService} from './health.service';
import { HealthController } from './health.controller';

describe('Publisher health check', () => {
  let app: INestApplication;
  let healthController: HealthController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        HealthModule,
	 ]
    })
    .compile();
    healthController = app.get<HealthController>(HealthController);		
  });

  it('controller to be defined', () => {
    expect(healthController).toBeDefined();
  });

});
