import { SetMetadata } from '@nestjs/common';

/**
 * Class Decorator to determine that the class implements the interface IHealthCheckService
 */
export function HealthCheckService(serviceName: string) {
  return SetMetadata(HEALTH_CHECK_SERVICE_META_KEY, serviceName);
}

export const HEALTH_CHECK_SERVICE_META_KEY = 'HEALTH_CHECK_SERVICE';
