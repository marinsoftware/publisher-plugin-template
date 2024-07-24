import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

// e.g admin/status/{service-name}
@Controller('admin/status/marin-publisherName-api-service')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}


  @Get()
  @ApiOperation({summary: 'Get Call for Health Check all level. Required*'})
  @ApiResponse({
    status: 200,
    description: 'Health Check Api'

  })
  healthChecks() {
    return this.healthService.healthCheck();
  }

  @Get('/L1')
  @ApiOperation({summary: 'Get Call for Health Check level L1. Required*'})
  @ApiResponse({
    status: 200,
    description: 'Health Check Api Level 1'

  })
  healthCheckL1() {
    return this.healthService.healthCheckL1();
  }

  @Get('/L2')
  @ApiOperation({summary: 'Get Call for Health Check level L2. Required*'})
  @ApiResponse({
    status: 200,
    description: 'Health Check Api Level 2'

  })
  healthCheckL2() {
    return this.healthService.healthCheckL2();
  }

  @Get('/L3')
  @ApiOperation({summary: 'Get Call for Health Check level L3'})
  @ApiResponse({
    status: 200,
    description: 'Health Check Api Level 3'

  })
  healthCheckL3() {
    return this.healthService.healthCheckL3();
  }

}