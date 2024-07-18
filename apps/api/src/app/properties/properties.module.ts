import { Module } from '@nestjs/common';
import { PublisherApiService } from "../services/publisher_api.service";
import { HttpModule } from "@nestjs/axios";
import { PropertiesController } from "./properties.controller";

@Module({
  imports: [HttpModule],
  controllers: [PropertiesController],
  providers: [PublisherApiService]
})
export class PropertiesModule {

}

