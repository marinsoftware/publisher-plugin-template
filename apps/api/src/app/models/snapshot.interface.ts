import { ApiProperty } from "@nestjs/swagger";

export class SnapshotRequest {
  advertiserId: number;
  reportDate: string;
  reportType: string
  reportMetrics: string[];
}

export class SnapshotRequestDTO implements SnapshotRequest {
  @ApiProperty({
    example: {
      advertiserId: 600001,
      reportDate: "2022-10-01",
      reportType: "keyword",
      reportMetrics: ["date", "keywordId", "searchedKeyword", "biddedKeyword", "matchType",
        "campaignName", "adGroupName", "campaignId", "adGroupId",
        "ntbUnits3days", "ntbOrders3days", "ntbRevenue3days", "ntbUnits14days", "ntbOrders14days",
        "ntbRevenue14days", "ntbUnits30days", "ntbOrders30days", "ntbRevenue30days", "bid", "numAdsShown",
        "numAdsClicks", "adSpend", "directAttributedSales3days", "directAttributedSales14days",
        "directAttributedSales30days", "attributedUnits3days", "attributedUnits14days", "attributedUnits30days",
        "brandAttributedSales3days", "brandAttributedSales14days", " brandAttributedSales30days",
        "relatedAttributedSales3days","relatedAttributedSales14days",
        "relatedAttributedSales30days", "attributedOrders3days", "attributedOrders14days",
        "attributedOrders30days"]}
    , description: "The create any generic marin object accepted"
  })

  advertiserId: number;
  reportDate: string;
  reportMetrics: string[];
  reportType: string;

  constructor(advertiserId: number, reportDate: string, reportMetrics: string[], reportType: string) {
    this.advertiserId = 2572611;
    this.reportDate = reportDate;
    this.reportMetrics = reportMetrics;
    this.reportType =reportType;
  }
}

export class SnapshotResponse{
  granularity: [
    {
      impressions: number;
      taps: number;
      localSpend: { amount: string, currency: string };
      date: string;
    },
  ];
  metadata: {
    adGroupId: number;
    campaignId: number;
  }
}