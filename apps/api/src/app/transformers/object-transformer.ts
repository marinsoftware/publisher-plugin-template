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
        // confirm status values from publisher documentation channel
        case 'running':
          marinCampaign.status = '{STATUS}';
          break;
        case 'paused':
          marinCampaign.status = '{STATUS}';
          break;
        default:
          marinCampaign.status = '{STATUS}';
      }
      if (publisherCampaign.id) {
        // confirm id value from publisher documentation
        marinCampaign.id = publisherCampaign.id.toString();
      }
      marinCampaign.properties = [];
      let property;   
      if (publisherCampaign.startTime) {
        // confirm date value from publisher documentation
        property = {
          name: "start_date", 
          value: "{Date}"
        };
        marinCampaign.properties.push(property)
      }
      if (publisherCampaign.endTime) {
        property = {
          name: "end_date", 
          value: '{END_DATE}'
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
          publisherCampaign.startTime = `${property.value}`;
          break;
        case 'end_date':
          publisherCampaign.endTime = `${property.value}`;
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
          marinAdGroup.status = 'adGroup.status.value';
          break;
        case 'paused':
          marinAdGroup.status = 'adGroup.status.value';
          break;
        case 'deleted':
          marinAdGroup.status = 'adGroup.status.value';
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
      if (adGroup.startTime) {
        property = {
          name: "startTime",
          value: adGroup.value
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

  return marinKeywords;
}

function transformMarinAdgroup(marinAdGroups: MarinSingleObj[], requestType: string): PublisherAdGroup[] {
  const allAdgroups: PublisherAdGroup[] = [];
  marinAdGroups.forEach(adgroup => {
    const publisherAdGroup = <PublisherAdGroup>{};
    if (adgroup.parentId) {
      publisherAdGroup.campaignId = Number(adgroup.parentId);
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
        if (properties.name == 'pricingModel') {
          publisherAdGroup.pricingModel = properties.value;
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
