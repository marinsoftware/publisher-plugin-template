import { MarinLogger } from '@libs/logger';
import { IHealthCheckService } from 'apps/api/src/app/health/health.types';
import { HealthCheckFactory } from './health-check.factory';

describe('health-check.factory', () => {
  let factory: HealthCheckFactory;
  let service: IHealthCheckService;

  beforeEach(() => {
    factory = new HealthCheckFactory(new MarinLogger({} as any));
    service = {
      getServiceName: () => 'serviceName',
      healthCheck: jest.fn().mockResolvedValue({
        healthy: true,
      }),
    };

    factory.registerService(service);
  });

  it('services to be registered', () => {
    expect(factory.length).toEqual(1);
  });

  it('performs the health check', async () => {
    const healthCheck = await factory.performHealthChecks('L1');
    expect(service.healthCheck).toHaveBeenCalledWith('L1');
    expect(healthCheck).toEqual({
      serviceName: {
        healthy: true,
      },
    });
  });
});
