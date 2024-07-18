import { PublisherApiService } from "../services/publisher_api.service";
import { Controller } from "@nestjs/common";
import { ControllersService } from "../services/controllers.service";

@Controller('shoppingProducts')
export class ShoppingProductsController {

  constructor(private readonly walmartService: PublisherApiService, private readonly controllerService: ControllersService) {
  }

  // @Get()
  // @ApiOperation({summary: 'Get all shopping products'})
  // @ApiResponse({
  //   status: 200,
  //   description: 'Retrieve all shopping products for a specific advertiser',
  //   isArray: true,
  // })
  // async get( @Query('accountId') accountId: number, @Query('publisherId') publisherId?: number, @Query('publisherName') publisherName?: string) {
  //   return this.controllerService.getAllShoppingProducts(accountId);
  // }

  // @Post()
  // @ApiOperation({summary: 'Get all items published'})
  // @ApiResponse({
  //   status: 200,
  //   description: 'Retrieve all items published on walmart',
  //   isArray: true,
  // })
  // GetItemSearch(@Body() shoppingProducts: WalmartShoppingProductsRequest, @Query('accountId') accountId: number, @Query('publisherId') publisherId?: number,@Query('publisherName') publisherName?: string) {
  //   return this.walmartService.getItemSearch(shoppingProducts).pipe(map(items => {
  //     return transformWalmartShoppingProducts(items, accountId);
  //   }));
  // }

}
