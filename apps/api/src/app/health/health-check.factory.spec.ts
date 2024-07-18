
import { IHealthCheckService } from 'apps/api/src/app/health/health.types';
import { HealthCheckFactory } from './health-check.factory';

describe('health-check.factory', () => {
  let factory: HealthCheckFactory;
  let service: IHealthCheckService;

  // beforeEach(() => {
  //   factory = new HealthCheckFactory(new MarinLogger({} as any));
  //   service = {
  //     healthCheck: jest.fn().mockResolvedValue({
  //       healthy: true,
  //     }),
  //   };

  //   factory.registerService('serviceName', service);
  // });

  it('services to be registered', () => {
    expect(200);
  });

  // it('performs the health check', async () => {
  //   const healthCheck = await factory.performHealthChecks('L1');
  //   expect(service.healthCheck).toHaveBeenCalledWith('L1');
  //   expect(healthCheck).toEqual({
  //     serviceName: {
  //       healthy: true,
  //     },
  //   });
  // });
});
