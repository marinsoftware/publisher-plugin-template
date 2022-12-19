import { contextService, VersionService } from '@libs/core';
import { Controller, Get, Param } from '@nestjs/common';
import { HealthCheckFactory } from './health-check.factory';

@Controller()
export class HealthController {

  constructor(protected versionService: VersionService, protected healthCheckFactory: HealthCheckFactory) {}

  @Get(`status/${contextService.getApplicationName()}/:level`)
  async check(@Param('level') level: string) {
    if (level === 'L1') {
      return this.getHealthCheckL1();
    }

    const healthChecks = await this.healthCheckFactory.performHealthChecks(level);
    return {
      [level]: healthChecks,
    }
  }

  /**
   * Get the level 1 health check
   */
  public async getHealthCheckL1(): Promise<HealthCheckL1Response> {
    const versionHealthCheck: VersionHealthCheckResponse = {
      healthy: false,
    };

    try {
      // Get the version
      versionHealthCheck.version = await this.versionService.version();
      versionHealthCheck.healthy = true;
    } catch(err) {
      versionHealthCheck.error = err;
    }

    // Return the result of the check
    return {
      [contextService.getApplicationName()]: {
        L1: {
          [contextService.getApplicationName()]: {
            healthy: true,
          },
          VersionHealthCheck: versionHealthCheck,
        },
      },
    }
  }
}

type VersionHealthCheckResponse = {
  healthy: boolean;
  version?: string;
  error?: string;
}

type HealthCheckL1Response = {
  [key: string]: {
    L1: {
      [key: string]: {
        healthy: boolean;
      },
      VersionHealthCheck: VersionHealthCheckResponse,
    }
  }
}