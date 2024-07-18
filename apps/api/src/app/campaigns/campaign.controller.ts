import {Controller, Get, Post, Body, Query, Put, Delete, HttpException, HttpStatus, Logger} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { transformWalmartCampaign, transformMarinCampaign } from "../transformers/object-transformer";
import { PublisherApiService } from "../services/publisher_api.service";
import { PublisherUtil } from "../services/publisher_utils.service"
import { MarinSingleObj } from "../models/marin-object.interface";
import { WalmartCampaign } from "../models/walmart-objects";

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
    let publisherCampaignList = [];
    let offset: number = 0;
    let publisherResponse;
    let access_token: string;
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    do{
      publisherResponse = await this.publisherService.getPublisherCampaigns(accountId, campaignId, offset, access_token)
      if (campaignId){
        publisherCampaignList.push(...[publisherResponse.data])        
        break
      }
      offset = offset + publisherResponse.pagination.itemsPerPage
      publisherCampaignList.push(...publisherResponse.data)

    } while (offset != publisherResponse.pagination.totalResults)
    return transformWalmartCampaign(publisherCampaignList)
  }

  @Post()
  @ApiOperation({ summary: 'Create campaigns' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createCampaignDto: MarinSingleObj[], @Query('accountId') accountId: number, @Query('refreshToken') token: string) {
    this.logger.log('Create createCampaign Dto Apple Params', createCampaignDto);
    let access_token: string;
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const walmartCampaigns: WalmartCampaign[] = transformMarinCampaign(createCampaignDto, "post");
    console.log("POST request payload after transformMarinCampaign", walmartCampaigns);
    return await this.publisherService.createCampaigns(walmartCampaigns, createCampaignDto, accountId, access_token);
  }

  @Put()
  @ApiOperation({ summary: 'Edit campaigns' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async edit(@Body() createCampaignDto: MarinSingleObj[], @Query('accountId') accountId: number, @Query('refreshToken') token: string) {
    this.logger.log('Put Campaign Dto Apple Params', createCampaignDto);
    let access_token: string;
    try {
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }    
    const publisherCampaigns: WalmartCampaign[] = transformMarinCampaign(createCampaignDto, "put");
    console.log("PUT request payload after transformMarinCampaign", publisherCampaigns);
    return this.publisherService.editPublisherCampaigns(publisherCampaigns, createCampaignDto, accountId, access_token);
  }

  @Delete()
  @ApiOperation({summary: "Delete campaigns"})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async delete(@Body() createCampaignDto: MarinSingleObj[], @Query('accountId') accountId: number, @Query('refreshToken') token: string){
    let access_token: string;
    try {
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const publisherCampaigns: WalmartCampaign[] = transformMarinCampaign(createCampaignDto, 'delete');
    return this.publisherService.deleteCampaigns(publisherCampaigns, createCampaignDto, access_token, accountId);
  }
}
