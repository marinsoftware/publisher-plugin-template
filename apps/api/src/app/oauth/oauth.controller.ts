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

  @Post('publisherAccounts')
  @ApiOperation({ summary: 'Retrieve publisher Accounts' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async retrievepublisheraccounts(@Body() accountsDto: PublisherAccountsDto){
    this.logger.log("info", `retrievepublisheraccounts-> ${accountsDto}`);
    return await this.publihsersService.retrievepublisheraccounts(accountsDto);
  }
}