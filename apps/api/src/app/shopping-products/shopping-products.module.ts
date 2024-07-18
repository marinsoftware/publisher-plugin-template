import { Module } from '@nestjs/common';
import { PublisherApiService } from "../services/publisher_api.service";
import { HttpModule } from "@nestjs/axios";
import { ShoppingProductsController } from "./shopping-products.controller";
import { ControllersService } from "../services/controllers.service";

@Module({
  imports: [HttpModule],
  controllers: [ShoppingProductsController],
  providers: [PublisherApiService, ControllersService]
})
export class ShoppingProductsModule {}
