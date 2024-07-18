import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingProductsController } from './shopping-products.controller';
import { HttpModule } from '@nestjs/axios';
import { PublisherApiService } from "../services/publisher_api.service";
import { ControllersService } from "../services/controllers.service";
import { PublisherShoppingProduct } from "../models/publisher-objects";


describe('Shopping Products', () => {
  let shoppingController: ShoppingProductsController;
  let publisherService: PublisherApiService;
  let publisherShoppingObj;
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
    publisherService = app.get<PublisherApiService>(PublisherApiService);
    controllersService = app.get<ControllersService>(ControllersService);
    publisherShoppingObj = <PublisherShoppingProduct> {
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
  });
});
