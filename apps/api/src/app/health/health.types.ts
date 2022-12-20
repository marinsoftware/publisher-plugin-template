// Interface that all services that require a health check must implement
export interface IHealthCheckService<Response extends HealthCheckResponse = HealthCheckResponse> {
  /**
   * Get the service name that the service has for the health check response
   */
  getServiceName: () => string;
  /**
   * Perform the health check given a level, e.g. L1, L2 ...
   */
  healthCheck: (level: string) => Promise<Response>;
}

/**
 * Minimum response type
 */
export type HealthCheckResponse = {
  healthy: boolean;
  stack: string;
  message: string;
};
