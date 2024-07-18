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

  getAllAdItems(accountId: number, campaignId?: number) {
    if (campaignId != undefined) {
      return this.publisherService.getAdItem(campaignId).pipe(map(adItems => {
        return transformPublisherAdItems(adItems);
      }));
    } else {
      return this.publisherService.getCampaigns(accountId).pipe(
        take(1),
        concatMap((publisherCampaigns: PublisherCampaign[]) => {
          let enabledCampaigns = publisherCampaigns.filter(obj => obj.displayStatus != 'Completed');
          return this.publisherService.getAdItems({}, enabledCampaigns).pipe(
            take(1),
            map((marinSingleObjs: MarinSingleObj[]) => {
              return marinSingleObjs;
            })
          )
        })
      )
    }
  }
  getAllShoppingProducts(accountId){
    return [] 
  }
}
