import { PublisherApiService } from "../services/publisher_api.service";
import { PublisherUtil } from "../services/publisher_utils.service"
import {Body, Controller, Get, Post, Put, Delete, Query, HttpException, HttpStatus, Logger} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { transformMarinAdItems, transformWalmartAdItems } from "../transformers/object-transformer";
import { MarinSingleObj } from "../models/marin-object.interface";
import { WalmartAdItem } from "../models/walmart-objects";
import { CampaignController } from "../campaigns/campaign.controller"
import { AdGroupsController } from "../groups/ad-groups.controller";

@Controller('ads')
export class AdItemsController {
  constructor(
    private readonly walmartService: PublisherApiService, 
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
    let publisherAds = [];
    let publisherResponse;
    let access_token: string;
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token;
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const campaignResponseList = await this.campaigncontroller.get(accountId, token);
    for(const campaign of campaignResponseList){
      const adgroupResponseList = await this.adGroupscontroller.get(accountId, token, Number(campaign.id));
      for(const adgroupObj of adgroupResponseList){
        let offset: number = 0;
        let default_ad = {
          id: "override with group id",
          adGroupId: "override with group id",
          name: 'Default Ad',
          status: 'enabled',
        }
        default_ad['adGroupId']=adgroupObj.id;
        default_ad['id']=adgroupObj.id;
        publisherAds.push(...[default_ad]);
        do{
          publisherResponse = await this.walmartService.getPublisherAdItems(accountId, access_token, campaign.id, adgroupObj.id, offset)
          if ((!publisherResponse.data) || (publisherResponse.data.length == 0)){
            break
          }
          offset = offset + publisherResponse.pagination.itemsPerPage;
          publisherAds.push(...publisherResponse.data);
        } while (offset != publisherResponse.pagination.totalResults)
      }
    }
    return transformWalmartAdItems(publisherAds)
  }

  @Post()
  @ApiOperation({ summary: 'Create Ad Items' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createDto: MarinSingleObj[], @Query('accountId') accountId: number, @Query('refreshToken') token: string) {
    this.logger.log('Create AdItem Dto Apple Params', createDto);
    let access_token: string;
    let publisherAdgroupList = [];
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const campaignResponseList = await this.campaigncontroller.get(accountId, token);
    for(const compaign of campaignResponseList){
      let offset: number = 0;
      let publisherAdgroupResponse;
      do{
        publisherAdgroupResponse = await this.walmartService.getPublisherAdGroups(accountId, access_token, compaign.id, offset)
        offset = offset + publisherAdgroupResponse.pagination.itemsPerPage;
        publisherAdgroupList.push(...publisherAdgroupResponse.data);
      } while (offset != publisherAdgroupResponse.pagination.totalResults)
    }

    const walmartAdItem: WalmartAdItem[] = transformMarinAdItems(createDto);
    return this.walmartService.createAdItem(walmartAdItem, createDto, publisherAdgroupList, accountId, access_token);
  }

  @Put()
  @ApiOperation({ summary: 'Edit Ad Items' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async edit(@Body() editAdItems: MarinSingleObj[], @Query('accountId') accountId: number, @Query('refreshToken') token: string) {
    this.logger.log('Edit AdItem Dto Apple Params', editAdItems);
    let access_token: string;
    let publisherAdgroupList = [];
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const campaignResponseList = await this.campaigncontroller.get(accountId, token);
    for(const compaign of campaignResponseList){
      let offset: number = 0;
      let publisherAdgroupResponse;
      do{
        publisherAdgroupResponse = await this.walmartService.getPublisherAdGroups(accountId, access_token, compaign.id, offset)
        offset = offset + publisherAdgroupResponse.pagination.itemsPerPage;
        publisherAdgroupList.push(...publisherAdgroupResponse.data);
      } while (offset != publisherAdgroupResponse.pagination.totalResults)
    }
    const walmartAdItem: WalmartAdItem[] = transformMarinAdItems(editAdItems);
    return this.walmartService.editAdItem(walmartAdItem, editAdItems, publisherAdgroupList, accountId, access_token);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete Ad Items' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async delete(@Body() editAdItems: MarinSingleObj[], @Query('accountId') accountId: number, @Query('refreshToken') token: string) {
    this.logger.log('Delete AdItem Dto Apple Params', editAdItems);
    let access_token: string;
    let publisherAdgroupList = [];
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const campaignResponseList = await this.campaigncontroller.get(accountId, token);
    for(const compaign of campaignResponseList){
      let offset: number = 0;
      let publisherAdgroupResponse;
      do{
        publisherAdgroupResponse = await this.walmartService.getPublisherAdGroups(accountId, access_token, compaign.id, offset)
        offset = offset + publisherAdgroupResponse.pagination.itemsPerPage;
        publisherAdgroupList.push(...publisherAdgroupResponse.data);
      } while (offset != publisherAdgroupResponse.pagination.totalResults)
    }
    const walmartAdItem: WalmartAdItem[] = transformMarinAdItems(editAdItems);
    return this.walmartService.deleteAdItem(walmartAdItem, editAdItems, publisherAdgroupList, accountId, access_token);
  }
}
