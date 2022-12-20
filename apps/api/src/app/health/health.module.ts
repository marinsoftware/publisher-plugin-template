import { CoreModule } from '@libs/core';
import { LoggerModule } from '@libs/logger';
import { Module, OnModuleInit } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService, RouterModule } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { HEALTH_CHECK_SERVICE_META_KEY } from './health.decorator';
import { HealthCheckFactory } from './health-check.factory';
import { HealthController } from './health.controller';

@Module({
  imports: [
    DiscoveryModule,
    CoreModule,
    LoggerModule,
    RouterModule.register([
      {
        path: 'admin',
        module: HealthModule,
      },
    ]),
  ],
  providers: [HealthCheckFactory],
  controllers: [HealthController],
  exports: [HealthCheckFactory],
})
export class HealthModule implements OnModuleInit {
  constructor(protected discoveryService: DiscoveryService, protected healthCheckFactory: HealthCheckFactory) {}

  /**
   * Initialise the module
   */
  public onModuleInit(): void {
    // Get all the providers from the discovery service
    const providers = this.discoveryService.getProviders();

    // Find all the providers that have the health check meta-data,
    // then register it with the health check factory
    providers
      .filter((provider) => this.filterHealthCheckProvider(provider))
      .map((provider) => provider.instance)
      .forEach((healthService) => this.healthCheckFactory.registerService(healthService));
  }

  /**
   * Filter the provider to only return true if it contains the health check meta-data
   */
  protected filterHealthCheckProvider(provider: InstanceWrapper): boolean {
    return provider.metatype && Reflect.getMetadata(HEALTH_CHECK_SERVICE_META_KEY, provider.metatype);
  }
}
