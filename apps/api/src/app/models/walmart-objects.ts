export class WalmartCampaign {
  advertiserId: number;
  id: number;
  displayStatus: string;
  name: string;
  startTime: string;
  orgId: number;
  endTime: string;
  dailyBudgetAmount: PublisherBudget;
  budgetAmount: PublisherBudget;
  adChannelType:string;
  adamId: number;
  billingEvent: string;
  countriesOrRegions: string[];
  supplySources: string[];
  status: string;
}

export class PublisherKeyword {
  id: number;
  adGroupId: number;
  text: string;
  bidAmount: PublisherBudget;
  matchType: string;
  status: string;
}

export class PublisherAdGroup {
  id: number;
  campaignId: number;
  name: string;
  displayStatus: string;
  defaultBidAmount: PublisherBudget;
  status: string;
  pricingModel: string;
  startTime: string;
}

export class WalmartAdGroup {
  id: number;
  campaignId: number;
  name: string;
  displayStatus: string;
  defaultBidAmount: PublisherBudget;
}

export class WalmartAdItem {
  campaignId: number;
  adGroupId: number;
  itemId: string;
  id: string;
  bid: number;
  status: string;
  name: string;
  creativeId: number;
}


export class WalmartShoppingProduct {
  itemId: string;
  itemImageUrl: string;
  itemName: string;
  itemPageUrl: string;
  suggestedBid: number;
}

export class WalmartShoppingProductsRequest {
  advertiserId: number;
  searchText?: string;
  searchItemIds?;
}

export class PublisherBudget {
  amount?: string;
  currency?: string;
}


