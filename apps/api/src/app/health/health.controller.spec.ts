jest.mock('@libs/core');
import { contextService, CoreModule, VersionService } from '@libs/core';
import { LoggerModule } from '@libs/logger';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckFactory } from 'apps/api/src/app/health/health-check.factory';
import { HealthCheck, HealthController } from './health.controller';

describe('health.controller', () => {
  let versionSpy: jest.Mock;
  let controller: HealthController;

  beforeEach(async () => {
    versionSpy = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule, LoggerModule],
      controllers: [HealthController],
      providers: [
        {
          provide: VersionService,
          useValue: {
            version: versionSpy,
          },
        },
        {
          provide: HealthCheckFactory,
          useValue: {
            performHealthChecks: jest.fn().mockResolvedValue({
              'marin-service': {
                healthy: true,
                message: 'marin-service is up and alive',
                stack: '',
              },
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    (contextService.getApplicationName as jest.Mock).mockReturnValue('app');
  });

  it('performs a L2 check succesfully', async () => {
    versionSpy.mockResolvedValue('version');
    const result = await controller.check(HealthCheck.L2);
    expect(result.app).toEqual({
      [HealthCheck.L2]: {
        'marin-service': {
          healthy: true,
          message: 'marin-service is up and alive',
          stack: '',
        },
        versionHealthCheck: {
          version: 'version',
          healthy: true,
          stack: '',
          message: '',
        },
      },
    });
  });

  it('performs a L1 check with errors', async () => {
    versionSpy.mockRejectedValue('error');
    const result = await controller.check(HealthCheck.L1);

    expect(result.app).toEqual({
      L1: {
        app: {
          healthy: true,
          message: 'app is up and alive',
          stack: '',
        },
      },
    });
  });
});
