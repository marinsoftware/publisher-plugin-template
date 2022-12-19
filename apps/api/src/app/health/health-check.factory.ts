import { MarinLogger } from '@libs/logger';
import { Injectable } from '@nestjs/common';
import { HealthCheckResponse, IHealthCheckService } from './health.types';

@Injectable()
export class HealthCheckFactory {
  protected servicesToCheck = new Set<any>();

  constructor(protected logger: MarinLogger) {}

  /**
   * Register the service for health check
   */
  public registerService<ServiceType extends IHealthCheckService<HealthCheckResponseType>, HealthCheckResponseType extends HealthCheckResponse>(service: ServiceType): void {
    if (!this.servicesToCheck.has(service)) {
      this.logger.log(`HealthCheck => ${service.getServiceName()}`);
      this.servicesToCheck.add(service);
    }
  }

  /**
   * Perform the health check
   */
  public async performHealthChecks(level: string): Promise<HealthCheckResults> {
    const result = {};

    for(const service of this.servicesToCheck) {
      result[service.getServiceName()] = await service.healthCheck(level);
    }

    return result;
  }

  /**
   * Get the number of services registered
   */
  public get length(): number {
    return this.servicesToCheck.size;
  }
}

type HealthCheckResults = {
  [key: string]: HealthCheckResponse;
}
