import { PublisherApiService } from "../services/publisher_api.service";
import { PublisherUtil } from "../services/publisher_utils.service"
import {Body, Controller, Get, Post, Put, Delete, Query, HttpException, HttpStatus, Logger} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { transformMarinAdgroup, transformPublisherAdGroup } from "../transformers/object-transformer";
import { MarinSingleObj } from "../models/marin-object.interface";
import { PublisherAdGroup } from "../models/walmart-objects";
import { CampaignController } from "../campaigns/campaign.controller"

@Controller('groups')
export class AdGroupsController {

  constructor(
    private readonly walmartService: PublisherApiService,
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
    let publisherAdgroup = [];
    let publisherResponse;
    let access_token: string;
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token;
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if(campaignId && adgroupId){
      publisherResponse = await this.walmartService.getPublisherAdGroup(accountId, access_token, campaignId, adgroupId)
      publisherAdgroup.push(publisherResponse.data)
    }
    else {
      let campaignResponseList = []
      if (campaignId){
        campaignResponseList = [{"id": campaignId}];
      } else {
        campaignResponseList = await this.campaigncontroller.get(accountId, token);
      }
      for(const compaign of campaignResponseList){
        let offset: number = 0;
        do{
          publisherResponse = await this.walmartService.getPublisherAdGroups(accountId, access_token, compaign.id, offset)
          if ((!publisherResponse.data) || (publisherResponse.data.length == 0)){
            break
          }
          offset = offset + publisherResponse.pagination.itemsPerPage;
          publisherAdgroup.push(...publisherResponse.data);
        } while (offset != publisherResponse.pagination.totalResults)
      }
    }
    return transformPublisherAdGroup(publisherAdgroup, accountId)
  }

  @Post()
  @ApiOperation({ summary: 'Create campaigns' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createDto: MarinSingleObj[], @Query('accountId') accountId: number, @Query('refreshToken') token: string) {
    this.logger.log('Create Adgroup Dto Apple Params', createDto);
    let access_token: string;
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const walmartAdGroups: PublisherAdGroup[] = transformMarinAdgroup(createDto, "post");
    console.log("POST request payload after walmartAdGroups", walmartAdGroups);
    return this.walmartService.createAdGroups(walmartAdGroups, createDto, accountId, access_token);
  }

  @Put()
  @ApiOperation({ summary: 'Edit Ad Groups' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async edit(@Body() createDto: MarinSingleObj[], @Query('accountId') accountId: number, @Query('refreshToken') token: string ) {
    this.logger.log('Edit Adggroup Dto Apple Params', createDto);
    let access_token: string;
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token;
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    } 
    const walmartAdGroups: PublisherAdGroup[] = transformMarinAdgroup(createDto, "put");
    console.log("PUT request payload after walmartAdGroups", walmartAdGroups);
    return this.walmartService.editAdGroups(walmartAdGroups, createDto, accountId, access_token);
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
    const walmartAdGroups: PublisherAdGroup[] = transformMarinAdgroup(createDto, 'delete');
    return this.walmartService.deleteAdgroups(walmartAdGroups, createDto, access_token, accountId);
  }

}
