import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('properties')
export class PropertiesController {

  @Get()
  @ApiOperation({summary: 'Verify if shopping products are available'})
  @ApiResponse({
    status: 200,
    description: 'Shopping products availability for advertiser',
    isArray: true,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get(@Query('accountId') accountId: number, @Query('publisherId') publisherId?: number, @Query('publisherName') publisherName?: string, @Query('campaignId') campaignId?: number) {
    return [{"propertiesMap": {"fba_supported": true, "fcba_supported": true}}];
  }

}

