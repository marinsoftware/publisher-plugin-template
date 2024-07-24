import { Injectable, Inject, Logger, HttpException, HttpStatus, Res } from '@nestjs/common';
import { PublisherListJson } from './publishers-json';
import { Publisher } from './entities/publisher.entitie';
import {CreateOAuthUrlDto, PublisherAccountsDto} from './interfaces/oauth.dto'
import {PublisherUtil} from './utils/publisher_utils'
import config from './../../../config.helper';
import { environment } from "../../environments/environment";
const uuid = require('uuid');

@Injectable()
export class PublishersService {
  pubishers: Publisher[];
  constructor(
    // @Inject(CACHE_MANAGER) private cacheManager: Cache, 
    private readonly publisherUtil: PublisherUtil,
    private readonly logger: Logger,
  ){
    this.pubishers = PublisherListJson;  
  }

  getAll() {
    return this.pubishers;
  }

  async createoauthurl(request, options: CreateOAuthUrlDto) {
    options.publisher = options.publisher.toUpperCase();

    const uid = uuid.v4();
    let authorizationUrl = environment.AUTH_BASE_URL+'auth/oauth2/v2/authorize';
    authorizationUrl = authorizationUrl + "?response_type=code" + `&state=${uid}` + "&scope=searchads"
    authorizationUrl = authorizationUrl + "&client_id=" + config.APP_ID
    authorizationUrl = authorizationUrl + `&redirect_uri=${config.REDIRECT_URI}`

    this.logger.log('OAuth Url Response', {authorizationUrl: authorizationUrl});
    return {'grant_url': authorizationUrl};
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
    } catch (e){
      console.log("eror for access token", e)
      this.logger.log('Invalid Scope', {error: 'Invalid Scope'});
      throw new HttpException("Invalid Scope", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    publisherAccountsDetail.authenticationInfo.accessToken =  response.access_token;
    publisherAccountsDetail.authenticationInfo.refreshToken =  response.refresh_token;
    const account_detail = await this.publisherUtil.getAdAccountDetail(params.accountName, params.accountID, response.access_token);

    if (!account_detail){
      this.logger.log('Invalid Account ID', {error: 'Provided Account ID Does Not Exist ' + 'response.access_token>> '+ response.access_token + 'response.refresh_token>> '+ response.refresh_token});
      throw new HttpException("Invalid Account Id", HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      publisherAccountsDetail.currency =  account_detail.currency;
    }

    this.logger.log('Publisher Accounts Response', {publisherAccountsDetail: publisherAccountsDetail});
    return publisherAccountsDetail;
  }
}