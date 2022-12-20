import { contextService, VersionService } from '@libs/core';
import { Controller, Get, Param } from '@nestjs/common';
import { HealthCheckResponse } from 'apps/api/src/app/health/health.types';
import { HealthCheckFactory, HealthCheckResults } from './health-check.factory';

@Controller()
export class HealthController {
  constructor(protected versionService: VersionService, protected healthCheckFactory: HealthCheckFactory) {}

  @Get(`status/${contextService.getApplicationName()}/:level`)
  async check(@Param('level') level: HealthCheck) {
    if (level === HealthCheck.L1) {
      return this.getHealthCheckL1();
    } else if (level === HealthCheck.L2) {
      return this.getHealthCheckL2();
    } else if (level === HealthCheck.L3) {
      return this.getHealthCheckL3();
    }
  }

  /**
   * Get the level 1 health check
   */
  public async getHealthCheckL1(): Promise<HealthCheckResponseResults> {
    // Return the result of the check
    return {
      [contextService.getApplicationName()]: {
        [HealthCheck.L1]: {
          [contextService.getApplicationName()]: {
            healthy: true,
            message: `${contextService.getApplicationName()} is up and alive`,
            stack: '',
          },
        },
      },
    };
  }

  /**
   * Get the level 2 health check
   */
  public async getHealthCheckL2(): Promise<HealthCheckResponseResults> {
    const versionHealthCheck: VersionHealthCheckResponseResults = {
      healthy: false,
      stack: '',
      message: '',
    };

    try {
      // Get the version
      versionHealthCheck.version = await this.versionService.version();
      versionHealthCheck.healthy = true;
    } catch (err) {
      versionHealthCheck.error = err;
    }

    const healthChecks = await this.healthCheckFactory.performHealthChecks(HealthCheck.L2);
    healthChecks['versionHealthCheck'] = versionHealthCheck;
    // Return the result of the check
    return {
      [contextService.getApplicationName()]: {
        [HealthCheck.L2]: healthChecks,
      },
    };
  }

  /**
   * Get the level 2 health check
   */
  public async getHealthCheckL3(): Promise<HealthCheckResponseResults> {
    const healthChecks = await this.healthCheckFactory.performHealthChecks(HealthCheck.L3);

    // Return the result of the check
    return {
      [contextService.getApplicationName()]: {
        [HealthCheck.L3]: healthChecks,
      },
    };
  }
}

export enum HealthCheck {
  L1 = 'L1',
  L2 = 'L2',
  L3 = 'L3',
}

interface VersionHealthCheckResponseResults extends HealthCheckResponse {
  version?: string;
  error?: string;
}

type HealthCheckResponseResults = {
  [key: string]: {
    [key: string]: HealthCheckResults | VersionHealthCheckResponseResults;
  };
};
