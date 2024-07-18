import { Injectable, Inject, Logger, HttpException, HttpStatus, Res } from '@nestjs/common';
import { PublisherListJson } from './publishers-json';
import { SrePublisherListJson } from './sre-publisher-json';
import { Publisher } from './entities/publisher.entitie';
import {CreateOAuthUrlDto, PublisherAccountsDto} from './interfaces/oauth.dto'
import {PublisherUtil} from './utils/publisher_utils'
import config from './../../../config.helper';
import { environment } from "../../environments/environment";
const uuid = require('uuid');

@Injectable()
export class PublishersService {
  pubishers: Publisher[];
  srePubishers: Publisher[];
  redis;
  constructor(
    // @Inject(CACHE_MANAGER) private cacheManager: Cache, 
    private readonly publisherUtil: PublisherUtil,
    private readonly logger: Logger,
  ){
    this.pubishers = PublisherListJson;  
    this.srePubishers = SrePublisherListJson;
  }

  getAll() {
    return this.pubishers;
  }
  getSreAll(){
    return this.srePubishers;
  }

  async createoauthurl(request, options: CreateOAuthUrlDto) {
    this.logger.log('Create OAuth Url Params', options);
    console.log("request", request.url);
    options.publisher = options.publisher.toUpperCase();
    // if (config.REDIRECT_URI !== decodeURIComponent(options.redirect_uri)){
    //   this.logger.log('Invalid Redirect Uri', { error: options.redirect_uri });
    //   throw new HttpException('Invalid Redirect Uri', HttpStatus.INTERNAL_SERVER_ERROR)
    // }

    const uid = uuid.v4();
    let authorizationUrl = environment.AUTH_BASE_URL+'auth/oauth2/v2/authorize';
    authorizationUrl = authorizationUrl + "?response_type=code" + `&state=${uid}` + "&scope=searchads"
    authorizationUrl = authorizationUrl + "&client_id=" + config.APP_ID
    if(request.url.includes("/v1")){
      authorizationUrl = authorizationUrl + `&redirect_uri=${config.REDIRECT_V1_URI_JUSTADS}`
    } else {
      authorizationUrl = authorizationUrl + `&redirect_uri=${config.REDIRECT_URI_JUSTADS}`
    }

    this.logger.log('OAuth Url Response', {authorizationUrl: authorizationUrl});
    return {'grant_url': authorizationUrl};
  }

  async decodeOAuthUrl(state: string, code: string){
    this.logger.log("info", `decodeOAuthUrl req state: ${state} req code: ${code}`);
    let cacheObj: any;
    try{
      this.logger.log("info", `try start`);
    } catch (e){
      this.logger.log('Decode OAuth Url Error', {error: e});
      return
    }
    if(!cacheObj){
      return
    }
    this.logger.log("info", `final object before return -->  ${config.REDIRECT_URI}?state=${cacheObj}&code=${code}`);
    return {url: `${config.REDIRECT_URI}?state=${cacheObj}&code=${code}`}
  }

  async retrieveCacheObject(key: string){
    return this.redis.get(key);
  }

  async retrievev1publisheraccounts(params:PublisherAccountsDto){
    this.logger.log('Publisher Accounts Param', params);
    params.publisher = params.publisher.toUpperCase();
    const publisherAccountsDetail = {
        'publisher': 'GENERIC',
        'publisherDefinitionName': 'Other',
        'channel': 'OTHER',
        'needLinkToMarinMcc': false,
        'authenticationInfo': {'type': 'OAUTH2', 'accessToken': null, 'refreshToken': null},
        'customPublisherName': params.publisher,
        'clientId': params.clientID,
        'accountId': params.accountID,
        'currency': '',
        'reportingLevel': 'KEYWORD,CREATIVE',
        'hasExtId': 'true',
        'timezone': 'Pacific/Kiribati',
        'alias': params.accountName,
        'publisherRevenueConversionData': 'REVENUE_AND_CONVERSION'
    };
    let response: any;
    try{
      response = await this.publisherUtil.getPublisherToken(params.code, "CC");
    } catch (e){
      this.logger.log('Invalid Scope check extra', e);
      this.logger.log('Invalid Scope', {error: 'Invalid Scope'});
      throw new HttpException("Invalid Scope", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    publisherAccountsDetail.authenticationInfo.accessToken =  response.access_token;
    publisherAccountsDetail.authenticationInfo.refreshToken =  response.refresh_token;
    const account_detail = await this.publisherUtil.getAdAccountDetail(params.accountName, params.accountID, response.access_token);
    if (!account_detail){
      this.logger.log('Invalid Account ID', {error: 'Provided Account ID Does Not Exist'});
      throw new HttpException("Invalid Account Id", HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      publisherAccountsDetail.currency =  account_detail.currency;
    }

    this.logger.log('Publisher Accounts Response', {publisherAccountsDetail: publisherAccountsDetail});
    return publisherAccountsDetail;
  }
  async retrievepublisheraccounts(params:PublisherAccountsDto){
    this.logger.log('Publisher Accounts Param', params);
    params.publisher = params.publisher.toUpperCase();
    const publisherAccountsDetail = {
      "pcaUsername": params.accountID,
      "customerId": 1,
      "userId": 1,
      "pcaAlias": params.accountID,
      "linkedToMarinMcc": "false",
      "authType": "OAUTH2",
      "accessLevel": "WRITE",
      "linkNewCampaigns": 'True',
      "publisherDefinitionId": 137,
      'publisher': 'PUBGATEWAY',
      'publisherDefinitionName': params.publisher,
      'channel': 'PAID_SEARCH',
      'needLinkToMarinMcc': false,
      'authenticationInfo': {'type': 'OAUTH2', 'accessToken': null, 'refreshToken': null},
      'customPublisherName': params.publisher,
      'clientId': params.clientID,
      'accountId': params.accountID,
      'currency': '',
      'reportingLevel': 'KEYWORD,CREATIVE',
      'hasExtId': 'true',
      'timezone': 'Pacific/Kiribati',
      'alias': params.accountName,
      'publisherRevenueConversionData': 'REVENUE_AND_CONVERSION'
    };

    let response: any;
    try{
      response = await this.publisherUtil.getPublisherToken(params.code, "PG");
      console.log("response for access token", response)
    } catch (e){
      console.log("eror for access token", e)
      this.logger.log('Invalid Scope', {error: 'Invalid Scope'});
      throw new HttpException("Invalid Scope", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    publisherAccountsDetail.authenticationInfo.accessToken =  response.access_token;
    publisherAccountsDetail.authenticationInfo.refreshToken =  response.refresh_token;
    const account_detail = await this.publisherUtil.getAdAccountDetail(params.accountName, params.accountID, response.access_token);

    console.log("account_detail", account_detail)
    if (!account_detail){
      this.logger.log('Invalid Account ID', {error: 'Provided Account ID Does Not Exist ' + 'response.access_token>> '+ response.access_token + 'response.refresh_token>> '+ response.refresh_token});
      throw new HttpException("Invalid Account Id", HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      publisherAccountsDetail.currency =  account_detail.currency;
    }

    this.logger.log('Publisher Accounts Response', {publisherAccountsDetail: publisherAccountsDetail});
    return publisherAccountsDetail;
  }

  async decodeOAuthUrlSreResponse(state: string, code: string){
    this.logger.log("info", `decodeOAuthUrlSreResponse req state: ${state} req code: ${code}`);
    let cacheObj: any;
    try{
    } catch (e){
      this.logger.log('Decode OAuth Url Error', {error: e});
      return
    }
    if(!cacheObj){
      return
    }
    return {url: `${config.REDIRECT_URI}?state=${cacheObj}&code=${code}`}
  }
}