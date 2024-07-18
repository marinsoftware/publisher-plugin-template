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
    let access_token: string;
    // according to publisher modify publisherUtil.refreshAccessToken
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token;
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const publisherResponse = await this.publisherService.getPublisherKeywords(accountId, access_token)
    return transformPublisherkeywords(publisherResponse, accountId);
  }

  @Post()
  @ApiOperation({ summary: 'Create Keywords' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createDto: MarinSingleObj[], @Query('accountId') accountId: number, @Query('refreshToken') token: string) {
    let access_token: string;
    let publisherAdgroupList = [];
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const publisherKeywords: PublisherKeyword[] = transformMarinKeywords(createDto);
    return this.publisherService.createKeywords(publisherKeywords, createDto, accountId, access_token);
  }

  @Put()
  @ApiOperation({ summary: 'Edit Keywords' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async edit(@Body() createDto: MarinSingleObj[], @Query('accountId') accountId: number, @Query('refreshToken') token: string ) {
    let access_token: string;
    let publisherAdgroupList = [];
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token;
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    } 
    const publisherKeywords: PublisherKeyword[] = transformMarinKeywords(createDto, "put");
    return this.publisherService.editKeywords(publisherKeywords, createDto, publisherAdgroupList, accountId, access_token);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete Keywords' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async delete(@Body() createDto: MarinSingleObj[], @Query('accountId') accountId: number, @Query('refreshToken') token: string ) {
    let access_token: string;
    let publisherAdgroupList = [];
    try{
      const response = await this.publisherUtil.refreshAccessToken(token);
      access_token = response.access_token;
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const publisherKeywords: PublisherKeyword[] = transformMarinKeywords(createDto, "delete");
    return this.publisherService.deleteKeywords(publisherKeywords, createDto, accountId, access_token);
  }
}
