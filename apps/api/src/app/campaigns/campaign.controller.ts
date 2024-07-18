import {Controller, Get, Post, Body, Query, Put, Delete, HttpException, HttpStatus, Logger} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { transformPublisherCampaign, transformMarinCampaign } from "../transformers/object-transformer";
import { PublisherApiService } from "../services/publisher_api.service";
import { PublisherUtil } from "../services/publisher_utils.service"
import { MarinSingleObj } from "../models/marin-object.interface";
import { PublisherCampaign } from "../models/publisher-objects";

@Controller('campaigns')
export class CampaignController {

  constructor(private readonly publisherService: PublisherApiService, private readonly publisherUtil: PublisherUtil, private readonly logger: Logger) {}

  @Get()
  @ApiOperation({summary: 'Get All Campaigns'})
  @ApiResponse({
    status: 200,
    description: 'All Campaigns within advertiser',
    isArray: true
  })
  async get(@Query('accountId') accountId: number, @Query('refreshToken') token: string, @Query('publisherId') publisherId?: number,@Query('publisherName') publisherName?: string, @Query('campaignId') campaignId?: number) {
    let access_token: string;
    // according to publisher modify publisherUtil.refreshAccessToken
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token
    } catch (error){
      // if any exception occurs send status 500 wwith exception message
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    let publisherResponse = await this.publisherService.getPublisherCampaigns(accountId, campaignId, access_token)
    this.logger.log('Example to use log', "Example log value");
    return transformPublisherCampaign(publisherResponse)
  }

  @Post()
  @ApiOperation({ summary: 'Create campaigns' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createCampaignDto: MarinSingleObj[], @Query('accountId') accountId: number, @Query('refreshToken') token: string) {
    let access_token: string;
    // according to publisher modify publisherUtil.refreshAccessToken
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token
    } catch (error){
      // if any exception occurs send status 500 wwith exception message
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const publisherCampaigns: PublisherCampaign[] = transformMarinCampaign(createCampaignDto, "post");
    return await this.publisherService.createCampaigns(publisherCampaigns, createCampaignDto, accountId, access_token);
  }

  @Put()
  @ApiOperation({ summary: 'Edit campaigns' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async edit(@Body() createCampaignDto: MarinSingleObj[], @Query('accountId') accountId: number, @Query('refreshToken') token: string) {
     // according to publisher modify publisherUtil.refreshAccessToken
    let access_token: string;
    try {
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token
    } catch (error){
      // if any exception occurs send status 500 wwith exception message
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }    
    const publisherCampaigns: PublisherCampaign[] = transformMarinCampaign(createCampaignDto, "put");
    return this.publisherService.editPublisherCampaigns(publisherCampaigns, createCampaignDto, accountId, access_token);
  }

  @Delete()
  @ApiOperation({summary: "Delete campaigns"})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async delete(@Body() createCampaignDto: MarinSingleObj[], @Query('accountId') accountId: number, @Query('refreshToken') token: string){
    let access_token: string;
     // according to publisher modify publisherUtil.refreshAccessToken
    try {
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token
    } catch (error){
      // if any exception occurs send status 500 wwith exception message
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const publisherCampaigns: PublisherCampaign[] = transformMarinCampaign(createCampaignDto, 'delete');
    return this.publisherService.deleteCampaigns(publisherCampaigns, createCampaignDto, access_token, accountId);
  }
}
