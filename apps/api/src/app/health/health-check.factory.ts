import { MarinLogger } from '@libs/logger';
import { Injectable } from '@nestjs/common';
import { HealthCheckResponse, IHealthCheckService } from './health.types';

@Injectable()
export class HealthCheckFactory {
  protected servicesToCheck = new Map<string, any>();

  constructor(protected logger: MarinLogger) {}

  /**
   * Register the service for health check
   */
  public registerService<ServiceType extends IHealthCheckService<HealthCheckResponseType>, HealthCheckResponseType extends HealthCheckResponse>(
    serviceName: string,
    service: ServiceType
  ): void {
    if (!this.servicesToCheck.has(serviceName)) {
      this.logger.log(`HealthCheck => ${serviceName}`);
      this.servicesToCheck.set(serviceName, service);
    }
  }

  /**
   * Perform the health check
   */
  public async performHealthChecks(level: string): Promise<HealthCheckResults> {
    const result = {};

    for (const [serviceName, service] of this.servicesToCheck) {
      result[serviceName] = await service.healthCheck(level);
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

export interface HealthCheckResults {
  [key: string]: HealthCheckResponse;
}
