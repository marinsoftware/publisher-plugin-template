import { PublisherApiService } from "../services/publisher_api.service";
import { PublisherUtil } from "../services/publisher_utils.service"
import {Body, Controller, Get, Post, Put, Delete, Query, HttpException, HttpStatus, Logger} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { transformMarinKeywords, transformPublisherkeywords } from "../transformers/object-transformer";
import { MarinSingleObj } from "../models/marin-object.interface";
import { CampaignController } from "../campaigns/campaign.controller"
import { AdGroupsController } from "../groups/ad-groups.controller";
import { PublisherKeyword } from "../models/publisher-objects";

@Controller('keywords')
export class KeywordController {

  constructor(
    private readonly publisherService: PublisherApiService,
    private readonly publisherUtil: PublisherUtil, 
    private readonly logger: Logger,
    private readonly campaigncontroller: CampaignController,
    private readonly adGroupscontroller: AdGroupsController
  ) {
  }

  @Get()
  @ApiOperation({summary: 'Get All Keywords'})
  @ApiResponse({
    status: 200,
    description: 'All Keywords within advertiser',
    isArray: true
  })
  async get(@Query('accountId') accountId: number, @Query('publisherId') publisherId?: number,@Query('publisherName') publisherName?: string, @Query('refreshToken') token?: string) {
    let publisherKeyword = [];
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
        do{
          publisherResponse = await this.publisherService.getPublisherKeywords(accountId, access_token, campaign.id, adgroupObj.id, offset)
          if ((!publisherResponse.data) || (publisherResponse.data.length == 0)){
            break
          }
          offset = offset + publisherResponse.pagination.itemsPerPage;
          publisherKeyword.push(...publisherResponse.data);
        } while (offset < publisherResponse.pagination.totalResults)
      }
    }
    return transformPublisherkeywords(publisherKeyword, accountId);
  }

  @Post()
  @ApiOperation({ summary: 'Create Keywords' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createDto: MarinSingleObj[], @Query('accountId') accountId: number, @Query('refreshToken') token: string) {
    this.logger.log('Create Keyword Dto Apple Params', createDto);
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
        publisherAdgroupResponse = await this.publisherService.getPublisherAdGroups(accountId, access_token, compaign.id, offset)
        offset = offset + publisherAdgroupResponse.pagination.itemsPerPage;
        publisherAdgroupList.push(...publisherAdgroupResponse.data);
      } while (offset != publisherAdgroupResponse.pagination.totalResults)
    }
    const publisherKeywords: PublisherKeyword[] = transformMarinKeywords(createDto);
    return this.publisherService.createKeywords(publisherKeywords, createDto, publisherAdgroupList, accountId, access_token);
  }

  @Put()
  @ApiOperation({ summary: 'Edit Keywords' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async edit(@Body() createDto: MarinSingleObj[], @Query('accountId') accountId: number, @Query('refreshToken') token: string ) {
    this.logger.log('Edit Keyword Dto Apple Params', createDto);
    let access_token: string;
    let publisherAdgroupList = [];
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token;
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    } 
    const campaignResponseList = await this.campaigncontroller.get(accountId, token);
    for(const compaign of campaignResponseList){
      let offset: number = 0;
      let publisherAdgroupResponse;
      do{
        publisherAdgroupResponse = await this.publisherService.getPublisherAdGroups(accountId, access_token, compaign.id, offset)
        offset = offset + publisherAdgroupResponse.pagination.itemsPerPage;
        publisherAdgroupList.push(...publisherAdgroupResponse.data);
      } while (offset != publisherAdgroupResponse.pagination.totalResults)
    }
    const publisherKeywords: PublisherKeyword[] = transformMarinKeywords(createDto, "put");
    return this.publisherService.editKeywords(publisherKeywords, createDto, publisherAdgroupList, accountId, access_token);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete Keywords' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async delete(@Body() createDto: MarinSingleObj[], @Query('accountId') accountId: number, @Query('refreshToken') token: string ) {
    this.logger.log('Delete Keyword Dto Apple Params', createDto);
    let access_token: string;
    let publisherAdgroupList = [];
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token;
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const campaignResponseList = await this.campaigncontroller.get(accountId, token);
    for(const compaign of campaignResponseList){
      let offset: number = 0;
      let publisherAdgroupResponse;
      do{
        publisherAdgroupResponse = await this.publisherService.getPublisherAdGroups(accountId, access_token, compaign.id, offset)
        offset = offset + publisherAdgroupResponse.pagination.itemsPerPage;
        publisherAdgroupList.push(...publisherAdgroupResponse.data);
      } while (offset != publisherAdgroupResponse.pagination.totalResults)
    }
    const publisherKeywords: PublisherKeyword[] = transformMarinKeywords(createDto, "delete");
    return this.publisherService.deleteKeywords(publisherKeywords, createDto, publisherAdgroupList, accountId, access_token);
  }
}
