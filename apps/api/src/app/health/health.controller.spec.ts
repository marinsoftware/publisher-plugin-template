jest.mock('@libs/core');
import { CoreModule, VersionService, contextService } from '@libs/core';
import { LoggerModule } from '@libs/logger';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckFactory } from 'apps/api/src/app/health/health-check.factory';
import { HealthController } from './health.controller';

describe('health.controller', () => {
  let versionSpy: jest.Mock;
  let controller: HealthController;

  beforeEach(async () => {
    versionSpy = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CoreModule,
        LoggerModule,
      ],
      controllers: [
        HealthController
      ],
      providers: [
        {
          provide: VersionService,
          useValue: {
            version: versionSpy,
          }
        },
        HealthCheckFactory,
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    (contextService.getApplicationName as jest.Mock).mockReturnValue('app');
  });

  it('performs a L1 check succesfully', async () => {
    versionSpy.mockResolvedValue('version');
    const result = await controller.check('L1');

    expect(result.app).toEqual({
      L1: {
        app: {
          healthy: true,
        },
        VersionHealthCheck: {
          version: 'version',
          healthy: true,
        }
      }
    });
  });

  it('performs a L1 check with errors', async () => {
    versionSpy.mockRejectedValue('error');
    const result = await controller.check('L1');

    expect(result.app).toEqual({
      L1: {
        app: {
          healthy: true,
        },
        VersionHealthCheck: {
          error: 'error',
          healthy: false,
        },
      },
    });
  });

});
