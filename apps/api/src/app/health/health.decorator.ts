import { SetMetadata } from '@nestjs/common';

/**
 * Class Decorator to determine that the class implements the interface IHealthCheckService
 */
export function HealthCheckService() {
  return SetMetadata(HEALTH_CHECK_SERVICE_META_KEY, true);
}

export const HEALTH_CHECK_SERVICE_META_KEY = 'HEALTH_CHECK_SERVICE';