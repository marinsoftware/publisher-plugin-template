import { PublisherApiService } from "../services/publisher_api.service";
import { PublisherUtil } from "../services/publisher_utils.service"
import {Body, Controller, Get, Post, Put, Delete, Query, HttpException, HttpStatus, Logger} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { transformMarinAdgroup, transformPublisherAdGroup } from "../transformers/object-transformer";
import { MarinSingleObj } from "../models/marin-object.interface";
import { PublisherAdGroup } from "../models/publisher-objects";
import { CampaignController } from "../campaigns/campaign.controller"

@Controller('groups')
export class AdGroupsController {

  constructor(
    private readonly publisherService: PublisherApiService,
    private readonly publisherUtil: PublisherUtil, 
    private readonly logger: Logger,
    private readonly campaigncontroller: CampaignController
  ) {}


  @Get()
  @ApiOperation({summary: 'Get All Groups'})
  @ApiResponse({
    status: 200,
    description: 'Retrieve all ad groups for a specific campaign or advertiser',
    isArray: true,
  })
  async get(@Query('accountId') accountId: number, @Query('refreshToken') token: string, @Query('campaignId') campaignId?: number, @Query('publisherId') publisherId?: number,@Query('publisherName') publisherName?: string, @Query('adgroupId') adgroupId?: number) {

    let access_token: string;
    // according to publisher modify publisherUtil.refreshAccessToken
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token;
    } catch (error){
      // if any exception occurs send status 500 wwith exception message
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const publisherResponse = await this.publisherService.getPublisherAdGroups(accountId, access_token)
    return transformPublisherAdGroup(publisherResponse, accountId)
  }

  @Post()
  @ApiOperation({ summary: 'Create campaigns' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createDto: MarinSingleObj[], @Query('accountId') accountId: number, @Query('refreshToken') token: string) {
    let access_token: string;
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const publisherAdGroups: PublisherAdGroup[] = transformMarinAdgroup(createDto, "post");
    return this.publisherService.createAdGroups(publisherAdGroups, createDto, accountId, access_token);
  }

  @Put()
  @ApiOperation({ summary: 'Edit Ad Groups' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async edit(@Body() createDto: MarinSingleObj[], @Query('accountId') accountId: number, @Query('refreshToken') token: string ) {
    let access_token: string;
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token;
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    } 
    const publisherAdGroups: PublisherAdGroup[] = transformMarinAdgroup(createDto, "put");
    return this.publisherService.editAdGroups(publisherAdGroups, createDto, accountId, access_token);
  }

  @Delete()
  @ApiOperation({summary: "Delete adGroups"})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async delete(@Body() createDto: MarinSingleObj[], @Query('accountId') accountId: number, @Query('refreshToken') token: string){
    let access_token: string;
    try {
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const publisherAdGroups: PublisherAdGroup[] = transformMarinAdgroup(createDto, 'delete');
    return this.publisherService.deleteAdgroups(publisherAdGroups, createDto, access_token, accountId);
  }

}
