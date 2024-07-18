import {Controller, Get, Post, Body, Query, Put, Delete, HttpException, HttpStatus, Logger} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PublisherApiService } from "../services/publisher_api.service";
import { ControllersService } from "../services/controllers.service";
import { transformPublisherShoppingProducts } from '../transformers/object-transformer' 

@Controller('shoppingProducts')
export class ShoppingProductsController {

  constructor(private readonly publisherService: PublisherApiService, private readonly controllerService: ControllersService) {
  }

  @Get()
  @ApiOperation({summary: 'Get all shopping products'})
  @ApiResponse({
    status: 200,
    description: 'Retrieve all shopping products for a specific advertiser',
    isArray: true,
  })
  async get( @Query('accountId') accountId: number, @Query('publisherId') publisherId?: number, @Query('publisherName') publisherName?: string) {
    return this.controllerService.getAllShoppingProducts(accountId);
  }

  @Post()
  @ApiOperation({summary: 'Get all items published'})
  @ApiResponse({
    status: 200,
    description: 'Retrieve all items published on publisher',
    isArray: true,
  })
  GetItemSearch(@Body() shoppingProducts, @Query('accountId') accountId: number, @Query('publisherId') publisherId?: number,@Query('publisherName') publisherName?: string) {   
      return transformPublisherShoppingProducts(shoppingProducts, accountId);
  }

}
