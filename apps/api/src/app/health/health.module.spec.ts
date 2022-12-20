import { HealthCheckFactory } from './health-check.factory';
import { HEALTH_CHECK_SERVICE_META_KEY } from './health.decorator';
import { HealthModule } from './health.module';

describe('health.module', () => {
  let module: HealthModule;
  let healthProvider: any;
  let healthCheckFactory: HealthCheckFactory;

  beforeEach(async () => {
    healthProvider = {
      metatype: {},
      instance: {
        getServiceName: () => 'service name',
      },
    };
    const normalProvider = {
      metatype: {},
    };
    Reflect.defineMetadata(HEALTH_CHECK_SERVICE_META_KEY, true, healthProvider.metatype);

    healthCheckFactory = new HealthCheckFactory({ log: jest.fn() } as any);
    jest.spyOn(healthCheckFactory, 'registerService');
    module = new HealthModule(
      {
        getProviders: () => [healthProvider, normalProvider],
      } as any,
      healthCheckFactory
    );

    module.onModuleInit();
  });

  it('registers health service on module init', () => {
    expect(healthCheckFactory.registerService).toHaveBeenCalledTimes(1);
    expect(healthCheckFactory.length).toEqual(1);
  });
});
