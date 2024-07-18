import { Controller, Get, Post, Body, Logger, Req, Redirect } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Publisher } from '../oauth/entities/publisher.entitie';
import { PublishersService } from '../oauth/oauth.service';
import {CreateOAuthUrlDto, PublisherAccountsDto} from './interfaces/oauth.dto'
import config from './../../../config.helper';

@Controller()
export class PublishersController {
  constructor(private readonly publihsersService: PublishersService, private readonly logger: Logger) {
  }

  @Get('v1/publishers')
  @ApiOperation({ summary: 'Get Publishers' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Publisher,
    isArray: true,
  })
   getSrePublisher()  {
   return {'supportedPublishers': this.publihsersService.getSreAll()};
  }

  @Post('v1/oauth')
  @ApiOperation({ summary: 'Retrieve encoded auth URL for publisher' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createv1oauthurl(@Req() request, @Body() OAuthDto: CreateOAuthUrlDto){
    return await this.publihsersService.createoauthurl(request, OAuthDto);
  }

  @Get('v1/decodeOAuthUrl')
  @ApiOperation({ summary: 'Decode OAuth Url' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  @Redirect(`${config.REDIRECT_URI}`)
  async getv1decodeOAuthUrl(@Req() request)  {
   return await this.publihsersService.decodeOAuthUrl(request.query.state, request.query.code);
  }

  @Get('v1/decodeOAuthUrlSreResponse')
  @ApiOperation({ summary: 'Decode SreResponse OAuth Url' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  async decodev1OAuthUrlSreResponse(@Req() request) {
   return await this.publihsersService.decodeOAuthUrlSreResponse(request.query.state, request.query.code);
  }

  @Get('v1/decodeOAuthUrlSreRedirect')
  @ApiOperation({ summary: 'Decode Sre Redirect OAuth Url' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  @Redirect(`${config.REDIRECT_URI}`)
  async decodev1OAuthUrlSreRedirect(@Req() request) {
   return await this.publihsersService.decodeOAuthUrlSreResponse(request.query.state, request.query.code);
  }

  @Post('v1/publisherAccounts')
  @ApiOperation({ summary: 'Retrieve publisher Accounts' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async retrievev1publisheraccounts(@Body() accountsDto: PublisherAccountsDto){
    return await this.publihsersService.retrievev1publisheraccounts(accountsDto);
  }


  @Get('publishers')
  @ApiOperation({ summary: 'Get Publishers' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Publisher,
    isArray: true,
  })
   getAll()  {
   return {'supportedPublishers': this.publihsersService.getAll()};
  }

  @Post('oauth')
  @ApiOperation({ summary: 'Retrieve encoded auth URL for publisher' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createoauthurl(@Req() request, @Body() OAuthDto: CreateOAuthUrlDto){
    return await this.publihsersService.createoauthurl(request, OAuthDto);
  }

  @Get('decodeOAuthUrl')
  @ApiOperation({ summary: 'Decode OAuth Url' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  @Redirect(`${config.REDIRECT_URI}`)
  async getdecodeOAuthUrl(@Req() request)  {
   return await this.publihsersService.decodeOAuthUrl(request.query.state, request.query.code);
  }

  @Get('decodeOAuthUrlSreResponse')
  @ApiOperation({ summary: 'Decode SreResponse OAuth Url' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  async decodeOAuthUrlSreResponse(@Req() request) {
   return await this.publihsersService.decodeOAuthUrlSreResponse(request.query.state, request.query.code);
  }

  @Get('decodeOAuthUrlSreRedirect')
  @ApiOperation({ summary: 'Decode Sre Redirect OAuth Url' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  @Redirect(`${config.REDIRECT_URI}`)
  async decodeOAuthUrlSreRedirect(@Req() request) {
   return await this.publihsersService.decodeOAuthUrlSreResponse(request.query.state, request.query.code);
  }

  @Post('publisherAccounts')
  @ApiOperation({ summary: 'Retrieve publisher Accounts' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async retrievepublisheraccounts(@Body() accountsDto: PublisherAccountsDto){
    this.logger.log("info", `retrievepublisheraccounts-> ${accountsDto}`);
    return await this.publihsersService.retrievepublisheraccounts(accountsDto);
  }
}