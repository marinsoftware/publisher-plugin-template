import { Injectable } from "@nestjs/common";
import { map, take } from "rxjs";
import { transformPublisherAdItems} from "../transformers/object-transformer";
import { concatMap } from "rxjs/operators";
import { PublisherCampaign } from "../models/publisher-objects";
import { MarinSingleObj } from "../models/marin-object.interface";
import { PublisherApiService } from "./publisher_api.service";

@Injectable()
export class ControllersService {

  constructor(private readonly publisherService: PublisherApiService) {
  }
  getAllShoppingProducts(accountId){
    return [] 
  }
}
