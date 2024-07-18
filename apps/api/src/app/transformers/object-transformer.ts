import { MarinSingleObj } from "../models/marin-object.interface";
import { PublisherCampaign, PublisherAdItem, PublisherKeyword, PublisherShoppingProduct, PublisherAdGroup, } from "../models/publisher-objects";

function transformPublisherCampaign(publisherCampaigns): MarinSingleObj[] {
  const allMarinCampaigns: MarinSingleObj[] = [];
  if (publisherCampaigns){
    publisherCampaigns.forEach(publisherCampaign => {
      const marinCampaign = <MarinSingleObj>{};
      marinCampaign.name = publisherCampaign.name;
      marinCampaign.parentId = publisherCampaign.orgId.toString();
      switch (publisherCampaign.displayStatus.toLowerCase()) {
        // Please confirm status values from asa channel
        case 'running':
          marinCampaign.status = 'ACTIVE';
          break;
        case 'paused':
          marinCampaign.status = 'PAUSED';
          break;
        default:
          marinCampaign.status = 'PAUSED';
      }
      if (publisherCampaign.id) {
        marinCampaign.id = publisherCampaign.id.toString();
      }
      marinCampaign.properties = [];
      let property;
      if (publisherCampaign.adamId) {
        property = {
          name: "adamId",
          value: publisherCampaign.adamId
        };
        marinCampaign.properties.push(property)
      }
      if (publisherCampaign.billingEvent) {
        property = {
          name: "billing_event",
          value: publisherCampaign.billingEvent
        };
        marinCampaign.properties.push(property)
      }
      if (publisherCampaign.countriesOrRegions) {
        property = {
          name: "countriesOrRegions",
          value: publisherCampaign.countriesOrRegions.toString()
        };
        marinCampaign.properties.push(property)
      }      
      if (publisherCampaign.startTime) {
        property = {
          name: "start_date", 
          value: new Date(publisherCampaign.startTime).toISOString().slice(0, 10)
        };
        marinCampaign.properties.push(property)
      }
      if (publisherCampaign.endTime) {
        property = {
          name: "end_date", 
          value: new Date(publisherCampaign.endTime).toISOString().slice(0, 10)
        };
        marinCampaign.properties.push(property)
      }
      if (publisherCampaign.dailyBudgetAmount) {
        property = {
          name: "daily_budget",
          value: publisherCampaign.dailyBudgetAmount.amount
        };
        marinCampaign.properties.push(property)
        property = {
          name: "budget_type",
          value: 'DAILY'
        };
        marinCampaign.properties.push(property)
      }
      if (publisherCampaign.budgetAmount) {
        property = {
          name: "total_budget", 
          value: publisherCampaign.budgetAmount.amount.toString()
        };
        marinCampaign.properties.push(property)
        property = {
          name: "budget_type",
          value: 'LIFETIME'
        };
        marinCampaign.properties.push(property)
      }
      if (publisherCampaign.adChannelType) {
        property = {name: "publisher_campaign_type", value: publisherCampaign.adChannelType};
        marinCampaign.properties.push(property)
      }
      if (publisherCampaign.supplySources) {
        property = {
          name: "targeting_type",
          value: publisherCampaign.supplySources.toString()
        };
        marinCampaign.properties.push(property)
      }
      allMarinCampaigns.push(marinCampaign);
    })
  }
  return allMarinCampaigns;
}


function transformMarinCampaign(marinCampaign: MarinSingleObj[], requestType: string): PublisherCampaign[] {
  const allCampaigns: PublisherCampaign[] = [];
  marinCampaign.forEach(campaign => {
    const publisherCampaign = <PublisherCampaign>{};
    publisherCampaign.name = campaign.name;
    if ((requestType == 'put' || requestType == 'delete') && campaign.id) {
      publisherCampaign.id = Number(campaign.id);
    } else if (requestType != 'put') {
      publisherCampaign.orgId = Number(campaign.parentId);
    }

    switch (campaign.status.toUpperCase()) {
      case 'ACTIVE':
        publisherCampaign.status = 'ENABLED';
        break;
      case 'PAUSED':
        publisherCampaign.status = 'PAUSED';
        break;
      case 'DELETED':
        publisherCampaign.status = 'DELETED';
        break;  
      default:
        publisherCampaign.status = 'PAUSED';
    }

    campaign.properties.forEach(property => {
      switch (property.name) {
        case 'start_date':
          publisherCampaign.startTime = `${property.value}T00:00:00.000`;
          break;
        case 'end_date':
          publisherCampaign.endTime = `${property.value}T00:00:00.000`;
          break;
        case 'daily_budget':
            publisherCampaign.dailyBudgetAmount = {'amount': String(property.value), 'currency': 'USD'};
          break;
        case 'total_budget':
          publisherCampaign.budgetAmount = {'amount': String(property.value), 'currency': 'USD'};
          break;  
        case 'adamId':
          if (requestType != 'put') {
            publisherCampaign.adamId = Number(property.value);
          }
          break;
        case 'countriesOrRegions':
          property.value = property.value.replace(" ","");
          publisherCampaign.countriesOrRegions = property.value.split(",");
          break;
        case 'billing_event':
          if (requestType != 'put') {
            publisherCampaign.billingEvent = property.value.toString();
          }
          break;
        // need confirmation from product manager for targetting type list
        case 'targeting_type':
          if (requestType != 'put') {
            publisherCampaign.supplySources = property.value.split(",");
          }
          break; 
        case 'publisher_campaign_type':
          if (requestType != 'put') {
            publisherCampaign.adChannelType = property.value;
          }
          break; 
      }
    })
    allCampaigns.push(publisherCampaign);
  })
  return allCampaigns;
}

function transformPublisherCampaignForDelete(marinCampaign: MarinSingleObj[]): PublisherCampaign[] {
  const allCampaigns: PublisherCampaign[] = [];
  marinCampaign.forEach(campaign => {
    const publisherCampaign = <PublisherCampaign>{};
    if (campaign.id) {
      publisherCampaign.id = Number(campaign.id);
    }
    allCampaigns.push(publisherCampaign);
  })
  return allCampaigns;
}

function transformPublisherAdGroup(publisherAdGroup, accountId: number) : MarinSingleObj[] {
  const marinAdGroups = []
  if (publisherAdGroup){
    publisherAdGroup.forEach(adGroup => {
      const marinAdGroup = <MarinSingleObj>{};
      marinAdGroup.name = adGroup.name;
      switch (adGroup.displayStatus.toLowerCase()) {
        default:
          marinAdGroup.status = adGroup.displayStatus.toUpperCase();
        case 'running':
          marinAdGroup.status = 'ACTIVE';
          break;
        case 'paused':
          marinAdGroup.status = 'PAUSED';
          break;
        case 'deleted':
          marinAdGroup.status = 'DELETED';
          break;
      }
      if (adGroup.campaignId != undefined) {
        marinAdGroup.parentId = adGroup.campaignId.toString();
      }
      if (adGroup.id != undefined) {
        marinAdGroup.id = adGroup.id.toString();
      }
      marinAdGroup.properties = [];
      let property;
      if (adGroup.defaultBidAmount && adGroup.defaultBidAmount.amount) {
        property = {name: "max_cpc", value: adGroup.defaultBidAmount.amount};
        marinAdGroup.properties.push(property)
      }
      if (adGroup.pricingModel) {
        property = {name: "pricingModel", value: adGroup.pricingModel};
        marinAdGroup.properties.push(property)
      }
      if (adGroup.startTime) {
        property = {
          name: "startTime",
          value: new Date(adGroup.startTime).toISOString().slice(0, 10)
        };
        marinAdGroup.properties.push(property)
      }
      marinAdGroups.push(marinAdGroup);
    })
  }
  return marinAdGroups;
}

function transformPublisherkeywords(publisherkeywords, accountId: number) : MarinSingleObj[] {
  const marinKeywords = []
  if (publisherkeywords){
    publisherkeywords.forEach(keyword => {
      const marinKeyword = <MarinSingleObj>{};
      marinKeyword.name = keyword.text;
      switch (keyword.status.toLowerCase()) {
        default:
          marinKeyword.status = keyword.status.toUpperCase();
        case 'ACTIVE':
          marinKeyword.status = 'ACTIVE';
          break;
        case 'PAUSED':
          marinKeyword.status = 'PAUSED';
          break;
      }
      if (keyword.adGroupId != undefined) {
        marinKeyword.parentId = keyword.adGroupId.toString();
      }
      if (keyword.id != undefined) {
        marinKeyword.id = keyword.id.toString();
      }
      marinKeyword.properties = [];
      let property;
      if (keyword.bidAmount && keyword.bidAmount.amount) {
        property = {name: "max_cpc", value: keyword.bidAmount.amount};
        marinKeyword.properties.push(property)
      }
      if (keyword.matchType) {
        property = {name: "match_type", value: keyword.matchType};
        marinKeyword.properties.push(property)
      }
      marinKeywords.push(marinKeyword);
    })
  }
  // const dummyMarinAdGroup = <MarinSingleObj>{};
  // dummyMarinAdGroup.parentId = accountId.toString();
  // dummyMarinAdGroup.id = accountId.toString();

  // marinAdGroups.push(dummyMarinAdGroup);
  return marinKeywords;
}

function transformMarinAdgroup(marinAdGroups: MarinSingleObj[], requestType: string): PublisherAdGroup[] {
  const allAdgroups: PublisherAdGroup[] = [];
  marinAdGroups.forEach(adgroup => {
    const publisherAdGroup = <PublisherAdGroup>{};
    if (adgroup.parentId) {
      publisherAdGroup.campaignId = Number(adgroup.parentId);
    }
    if ((requestType == 'put' || requestType == 'delete') && adgroup.id) {
      publisherAdGroup.id = Number(adgroup.id)
    }
    if (requestType != 'put' && adgroup.name){
      publisherAdGroup.name = adgroup.name;
    }
    
    switch (adgroup.status.toUpperCase()) {
      case 'ACTIVE':
        publisherAdGroup.status = 'ENABLED';
        break;
      case 'PAUSED':
        publisherAdGroup.status = 'PAUSED';
        break;
      case 'DELETED':
        publisherAdGroup.status = 'DELETED';
        break;  
    }
    
    if (adgroup.properties){
      adgroup.properties.forEach(properties => {
        if (properties.name == 'max_cpc') {
          publisherAdGroup.defaultBidAmount = {'amount': String(properties.value), 'currency': 'USD'};
        }
        if (properties.name == 'pricingModel' && requestType != 'put') {
          publisherAdGroup.pricingModel = properties.value;
        }
        if (requestType != 'put' && properties.name == 'startTime') {
          publisherAdGroup.startTime = `${properties.value}T00:00:00.000`;
        }
      })
    }
    allAdgroups.push(publisherAdGroup);
  })
  return allAdgroups;
}

function transformPublisherAdItems(publisherAdItems) : MarinSingleObj[] {

  const marinAdItemsArray = []
  if (publisherAdItems){
    publisherAdItems.forEach(publisherAdItem => {
      const marinAdItems = <MarinSingleObj>{};
      marinAdItems.name = publisherAdItem.name;
      switch (publisherAdItem.status.toLowerCase()) {
        default:
          marinAdItems.status = publisherAdItem.status.toUpperCase();
        case 'enabled':
          marinAdItems.status = 'ACTIVE';
          break;
        case 'paused':
          marinAdItems.status = 'PAUSED';
          break;
        case 'deleted':
          marinAdItems.status = 'DELETED';
          break;
      }
      if (publisherAdItem.adGroupId != undefined) {
        marinAdItems.parentId = publisherAdItem.adGroupId.toString();
      }
      if (publisherAdItem.id != undefined) {
        marinAdItems.id = publisherAdItem.id.toString();
      }
      marinAdItems.properties = [];
      let property;
      if (publisherAdItem.creativeId) {
        property = {name: "ad_creative_id", value: publisherAdItem.creativeId};
        marinAdItems.properties.push(property)
      }
      marinAdItemsArray.push(marinAdItems);
    })
  }
  return marinAdItemsArray;
}

function transformMarinAdItems(marinAdItems: MarinSingleObj[], requestType?:string): PublisherAdItem[] {
  const allCampaigns: PublisherAdItem[] = [];
  marinAdItems.forEach(marinAdItem => {
    const publisherAdItems = <PublisherAdItem>{};
    publisherAdItems.adGroupId = Number(marinAdItem.parentId);
    publisherAdItems.name = marinAdItem.name;
    publisherAdItems.status = marinAdItem.status;
    switch (publisherAdItems.status.toUpperCase()) {
      case 'ACTIVE':
        publisherAdItems.status = 'ENABLED';
        break;
      case 'PAUSED':
        publisherAdItems.status = 'PAUSED';
        break;
    }
    if (marinAdItem.id != undefined) {
      publisherAdItems.id = String(marinAdItem.id);
    }
    marinAdItem.properties.forEach(property => {
      switch (property.name) {
        case 'ad_creative_id':
          publisherAdItems.creativeId = Number(property.value);
          break;
      }
    })
    
    allCampaigns.push(publisherAdItems);
  })
  return allCampaigns
}

function transformPublsherKeywords(publisherKeywords: PublisherKeyword[]) : MarinSingleObj[] {
  const allMarinKeywords: MarinSingleObj[] = [];

  publisherKeywords.forEach(publisherKeyword => {

    const marinKeyword = <MarinSingleObj>{};
    if (publisherKeyword.adGroupId) {
      marinKeyword.parentId = publisherKeyword.adGroupId.toString();
    }
    marinKeyword.name = publisherKeyword.text;
    if (publisherKeyword.status) {
      switch (publisherKeyword.status.toLowerCase()) {
        case 'live':
        case 'enabled':
          marinKeyword.status = 'ACTIVE';
          break;
        case 'paused':
          marinKeyword.status = 'PAUSED';
          break;
        case 'completed':
          marinKeyword.status = 'COMPLETED';
          break;
      }
    }
    if (publisherKeyword.id != undefined) {
      marinKeyword.id = publisherKeyword.id.toString();
    }
    marinKeyword.properties = [];
    let property;
    if (publisherKeyword.bidAmount && publisherKeyword.bidAmount.amount) {
      property = {name: "max_cpc", value: publisherKeyword.bidAmount.amount.toString()};
      marinKeyword.properties.push(property)
    }
    if (publisherKeyword.matchType) {
      property = {name: "match_type", value: publisherKeyword.matchType.toUpperCase()};
      marinKeyword.properties.push(property)
    }
    if (publisherKeyword.status) {
      property = {name: "review_status", value: publisherKeyword.status};
      marinKeyword.properties.push(property)
    }
    allMarinKeywords.push(marinKeyword);
  });

  return allMarinKeywords;
}

function transformMarinKeywords(marinKeyword: MarinSingleObj[], requestType?:string): PublisherKeyword[] {
  const allKeywords: PublisherKeyword[] = [];
  marinKeyword.forEach(keyword => {
    const publisherKeyword = <PublisherKeyword>{};
    publisherKeyword.text = keyword.name;
    switch (keyword.status) {
      case 'ACTIVE':
        publisherKeyword.status = 'ACTIVE';
        break;
      case 'PAUSED':
        publisherKeyword.status = 'PAUSED';
        break;
      case 'DELETED':
        publisherKeyword.status = 'DELETED';
        break;
    }
    if (keyword.id) {
      publisherKeyword.id = Number(keyword.id);
    }
    publisherKeyword.adGroupId = Number(keyword.parentId);
    keyword.properties.forEach(property => {
      switch (property.name) {
        case 'max_cpc':
          publisherKeyword.bidAmount = {'amount': String(property.value), 'currency': 'USD'};
          break;
        case 'match_type':
          if (property.value) {
            publisherKeyword.matchType = property.value.toUpperCase();
            break;
          }

        // case 'campaignId':
        //   publisherKeyword.campaignId = Number(property.value);
        //   break;
      }
    })
    allKeywords.push(publisherKeyword);
  })
  return allKeywords;
}

function transformPublisherShoppingProducts(publisherShoppingProducts: PublisherShoppingProduct[], accountId: number) : MarinSingleObj[] {
  const marinShoppingProducts = []
  publisherShoppingProducts.forEach(publisherShoppingProduct => {
    const marinShoppingProduct = <MarinSingleObj>{};
    marinShoppingProduct.name = publisherShoppingProduct.itemName;
    marinShoppingProduct.properties = [];
    let property;
    marinShoppingProduct.parentId = accountId.toString();
    if (publisherShoppingProduct.itemId) {
      property = {name: "sku", value: publisherShoppingProduct.itemId};
      marinShoppingProduct.id = publisherShoppingProduct.itemId;
      marinShoppingProduct.properties.push(property)
    }
    if (publisherShoppingProduct.itemImageUrl) {
      property = {name: "image_url", value: publisherShoppingProduct.itemImageUrl};
      marinShoppingProduct.properties.push(property)
    }
    if (publisherShoppingProduct.itemId) {
      property = {name: "destination_url", value: publisherShoppingProduct.itemPageUrl};
      marinShoppingProduct.properties.push(property)
    }
    if (publisherShoppingProduct.suggestedBid) {
      property = {name: "suggested_cpc", value: publisherShoppingProduct.suggestedBid.toString()};
      marinShoppingProduct.properties.push(property)
    }
    marinShoppingProducts.push(marinShoppingProduct);
  })
  const dummyMarinShoppingProduct = <MarinSingleObj>{};
  dummyMarinShoppingProduct.parentId = accountId.toString();
  dummyMarinShoppingProduct.id = accountId.toString();

  marinShoppingProducts.push(dummyMarinShoppingProduct);

  return marinShoppingProducts;
}

function transformMarinShoppingProducts(marinShoppingProducts: MarinSingleObj[]): PublisherShoppingProduct[] {
  const listShoppingProducts: PublisherShoppingProduct[] = [];
  marinShoppingProducts.forEach(marinShoppingProduct => {
    const publisherShoppingProduct = <PublisherShoppingProduct>{};
    publisherShoppingProduct.itemId = marinShoppingProduct.name;
    marinShoppingProduct.properties.forEach(property => {
      switch (property.name) {
        case 'sku':
          publisherShoppingProduct.itemId = property.value;
          break;
        case 'image_url':
          publisherShoppingProduct.itemImageUrl = property.value;
          break;
        case 'destination_url':
          publisherShoppingProduct.itemImageUrl = property.value;
          break;
        case 'suggested_cpc':
          publisherShoppingProduct.suggestedBid = Number(property.value);
          break;
      }
    })

    listShoppingProducts.push(publisherShoppingProduct);
  })

  return listShoppingProducts;
}

export { transformPublisherShoppingProducts, transformMarinShoppingProducts, transformMarinKeywords, transformPublsherKeywords, transformPublisherAdItems, transformMarinAdItems, transformPublisherAdGroup, transformMarinAdgroup , transformPublisherCampaign, transformMarinCampaign, transformPublisherCampaignForDelete, transformPublisherkeywords }
