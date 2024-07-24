import { PublisherApiService } from "../services/publisher_api.service";
import { PublisherUtil } from "../services/publisher_utils.service"
import {Body, Controller, Get, Post, Put, Delete, Query, HttpException, HttpStatus, Logger} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { transformMarinAdItems, transformPublisherAdItems } from "../transformers/object-transformer";
import { MarinSingleObj } from "../models/marin-object.interface";
import { PublisherAdItem } from "../models/publisher-objects";
import { CampaignController } from "../campaigns/campaign.controller"
import { AdGroupsController } from "../groups/ad-groups.controller";

@Controller('ads')
export class AdItemsController {
  constructor(
    private readonly publisherService: PublisherApiService, 
    private readonly publisherUtil: PublisherUtil, 
    private readonly logger: Logger,
    private readonly campaigncontroller: CampaignController,
    private readonly adGroupscontroller: AdGroupsController,
  ) {}

  @Get()
  @ApiOperation({summary: 'Get all ad items'})
  @ApiResponse({
    status: 200,
    description: 'Retrieve all ad items for a specific campaign or advertiser',
    isArray: true,
  })
  async get(@Query('accountId') accountId: number, @Query('refreshToken') token: string, @Query('publisherId') publisherId?: number, @Query('publisherName') publisherName?: string, @Query('campaignId') campaignId?: number, @Query('adgroupId') adgroupId?: number,) {
    let access_token: string;
    // according to publisher modify publisherUtil.refreshAccessToken
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token;
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const publisherResponse = await this.publisherService.getPublisherAdItems(accountId, access_token)
    return transformPublisherAdItems(publisherResponse)
  }

  @Post()
  @ApiOperation({ summary: 'Create Ad Items' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createDto: MarinSingleObj[], @Query('accountId') accountId: number, @Query('refreshToken') token: string) {
    let access_token: string;
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const publisherAdItem: PublisherAdItem[] = transformMarinAdItems(createDto);
    return this.publisherService.createAdItem(publisherAdItem, createDto, accountId, access_token);
  }

  @Put()
  @ApiOperation({ summary: 'Edit Ad Items' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async edit(@Body() editAdItems: MarinSingleObj[], @Query('accountId') accountId: number, @Query('refreshToken') token: string) {
    let access_token: string;
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const publisherAdItem: PublisherAdItem[] = transformMarinAdItems(editAdItems);
    return this.publisherService.editAdItem(publisherAdItem, editAdItems, accountId, access_token);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete Ad Items' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async delete(@Body() adItems: MarinSingleObj[], @Query('accountId') accountId: number, @Query('refreshToken') token: string) {
    let access_token: string;
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const publisherAdItem: PublisherAdItem[] = transformMarinAdItems(adItems);
    return this.publisherService.deleteAdItem(publisherAdItem, adItems, accountId, access_token);
  }
}
