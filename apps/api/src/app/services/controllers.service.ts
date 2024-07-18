import { Injectable } from "@nestjs/common";
import { map, take } from "rxjs";
import { transformWalmartAdItems, transformWalmartKeywords, transformWalmartShoppingProducts } from "../transformers/object-transformer";
import { catchError, concatMap } from "rxjs/operators";
import { WalmartAdGroup, WalmartCampaign } from "../models/walmart-objects";
import { MarinSingleObj } from "../models/marin-object.interface";
import { PublisherApiService } from "./publisher_api.service";

@Injectable()
export class ControllersService {

  constructor(private readonly walmartService: PublisherApiService) {
  }

  getAllAdItems(accountId: number, campaignId?: number) {
    if (campaignId != undefined) {
      return this.walmartService.getAdItem(campaignId).pipe(map(adItems => {
        return transformWalmartAdItems(adItems);
      }));
    } else {
      return this.walmartService.getCampaigns(accountId).pipe(
        take(1),
        concatMap((walmartCampaigns: WalmartCampaign[]) => {
          let enabledCampaigns = walmartCampaigns.filter(obj => obj.displayStatus != 'Completed');
          return this.walmartService.getAdItems({}, enabledCampaigns).pipe(
            take(1),
            map((marinSingleObjs: MarinSingleObj[]) => {
              return marinSingleObjs;
            })
          )
        })
      )
    }
  }
}
