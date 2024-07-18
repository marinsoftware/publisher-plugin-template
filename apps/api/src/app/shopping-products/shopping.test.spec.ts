import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingProductsController } from './shopping-products.controller';
import { HttpModule } from '@nestjs/axios';
import { of } from 'rxjs';
import { PublisherApiService } from "../services/publisher_api.service";
import { ControllersService } from "../services/controllers.service";
import { WalmartShoppingProduct } from "../models/walmart-objects";
import { transformWalmartShoppingProducts } from "../transformers/object-transformer";
import { MailerModule } from '@nestjs-modules/mailer';
import config from './../../../config.helper';


describe('Shopping Products', () => {
  let shoppingController: ShoppingProductsController;
  let walmartService: PublisherApiService;
  let walmartShoppingObj;
  let controllersService: ControllersService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
      ],
      controllers: [
        ShoppingProductsController,
      ],
      providers: [
        PublisherApiService,
        ControllersService
      ],
    })
    .compile();

    shoppingController = app.get<ShoppingProductsController>(ShoppingProductsController);
    walmartService = app.get<PublisherApiService>(PublisherApiService);
    controllersService = app.get<ControllersService>(ControllersService);
    walmartShoppingObj = <WalmartShoppingProduct> {
			"itemId": "string",
			"itemImageUrl": "string",
			"itemName": "string",
			"itemPageUrl": "string",
			"suggestedBid": 1,
    }
  });

  describe('Shopping', () => {
    it('controller to be defined', () => {
      expect(shoppingController).toBeDefined();
    });

    // it ('method get to be defined', () =>{
    //   expect(shoppingController.get).toBeDefined();
    // });

    // it ('method create to be defined', () =>{
    //   expect(shoppingController.GetItemSearch).toBeDefined();
    // });

    // it('should return an valid shopping object', done => {
		// 	const allItems = {
		// 		advertiserId: 1,
		// 		searchItemIds: "searchItemIds"
		// 	};
		// 	jest.spyOn(walmartService, 'makeApiCall').mockImplementation(
		// 		() => { return of(['dummy response']) }
		// 	);
		// 	walmartService.getItemSearch(allItems)
		// 	.subscribe(
		// 		(res) => {
		// 			expect(res).toBeInstanceOf(Array)
		// 			done();
		// 		}
		// 	);
    // });

		// it('successfully transform walmart shopping object list', () => {
		// 	const response = transformWalmartShoppingProducts([walmartShoppingObj], 1);
		// 	expect(response).toBeInstanceOf(Array)
		// 	expect(response[0]).toHaveProperty('name');
		// 	expect(response[0]).toHaveProperty('parentId');
		// 	expect(response[0]).toHaveProperty('id');
		// 	expect(response[0]).toHaveProperty('properties');
    // });
  });
});
