import { Injectable } from "@nestjs/common";
import { ControllersService } from "../services/controllers.service";
import { MarinSingleObj } from "../models/marin-object.interface";
import { parse } from "papaparse";

export enum ReportType {
    GROUP = "group",
    KEYWORD = "keyword",
    ADITEM = "creative",
}

export enum BadRequest {
    INVALID_DATE_FORMAT = "Bad Request: Format of date is invalid (yyyy-MM-dd).",
    INVALID_DATE_VALUE = "Bad Request: Date must be within 90 days of today.",
    INVALID_REPORT_TYPE = "Bad Request: Report type not recongized."
}

const ADITEM_METRICS: string[] = [
    "CAMPAIGN_ID",
    "AD_GROUP_ID",
    "AD_ID",
    "PAID_IMPRESSION",
    "TOTAL_CLICKTHROUGH",
    "SPEND_IN_DOLLAR"
];

const DATE_REGEX_yyyy_MM_dd = new RegExp(/^\d{4}-\d{2}-\d{2}$/);

@Injectable()
export class SnapshotService {
    constructor(
        private readonly controllerService: ControllersService,
    ) {}

    isValidReportType(reportType: string) {
        return reportType === ReportType.ADITEM || reportType === ReportType.GROUP || reportType == ReportType.KEYWORD;
    }

    isValidDateFormat_yyyy_MM_dd(reportDate: string) {
        return DATE_REGEX_yyyy_MM_dd.test(reportDate);
    }

    isWithinLast90Days(reportDate: string) {
        let date = new Date(reportDate);
        let date90DaysAgo = new Date();
        date90DaysAgo.setDate(new Date().getDate() - 90);
        return date > date90DaysAgo;
    }

    /**
     * Gets metric fields for report request dto based on type
     * @return {string[]}
     * @param type
     */

    getReportMetricsByType(type: string) {
      switch (type) {
          case ReportType.ADITEM:
              return ADITEM_METRICS;
          case ReportType.GROUP:
              return ADITEM_METRICS;
          case ReportType.KEYWORD:
              return ADITEM_METRICS;
          default:
              throw new Error("reportType not recognized: " + type);
      }
    }

    getReportParams(type: string, reportMetrics: string[]) {
      switch (type) {
        case ReportType.ADITEM:
          return {
            "granularity": "DAILY",
            "returnRowTotals": false,
            "returnGrandTotals": false,
            "returnRecordsWithNoMetrics": false,
            "selector": {
              "orderBy": [
                {
                    "field": "status",
                    "sortOrder": "ASCENDING"
                }
              ],
              "pagination": {
                "offset": 0,
                "limit": 1000
              }
            }
          };
        case ReportType.GROUP:
            return {
                "granularity": "DAILY",
                "returnRowTotals": false,
                "returnGrandTotals": false,
                "returnRecordsWithNoMetrics": false,
                "selector": {
                    "orderBy": [
                    {
                        "field": "startTime",
                        "sortOrder": "ASCENDING"
                    }
                    ],
                    "pagination": {
                    "offset": 0,
                    "limit": 1000
                    }
                }
            };
            case ReportType.KEYWORD:
                return {
                    "granularity": "DAILY",
                    "returnRowTotals": false,
                    "returnGrandTotals": false,
                    "returnRecordsWithNoMetrics": false,
                    "selector": {
                        "orderBy": [
                        {
                            "field": "localSpend",
                            "sortOrder": "ASCENDING"
                        }
                        ],
                        "pagination": {
                        "offset": 0,
                        "limit": 1000
                        }
                    }
                };
        default:
            throw new Error("reportType not recognized: " + type);
      }
    }

    processReportByReportType(report: any, reportType: string, accountId: number, searchTermReportUrl?: string){
      switch (reportType) {
          case ReportType.ADITEM:
              return this.processCreativeReport(report, reportType);
          case ReportType.GROUP:
              return this.processGroupReport(report, reportType);
          case ReportType.KEYWORD:
              return this.processKeywordReport(report, reportType, searchTermReportUrl);              
          default:
              throw new Error("reportType not recognized: " + reportType);
      }
    }

    processGroupReport(reportObjs, reportType: string, marinSingleObjs?: MarinSingleObj[]) {
      let responseList = []
      reportObjs.forEach(property => {
            property.granularity.forEach(object=>{
                let tmpObject = {};
                switch (object) {
                    default:
                    case(object.date):
                        tmpObject["reportDate"] = object.date;
                    case(property.metadata.campaignId):
                        tmpObject["campaignid"] = property.metadata.campaignId;
                    case(property.metadata.adGroupId):
                        tmpObject["adgroupid"] = property.metadata.adGroupId;
                        tmpObject["criterionid"] = property.metadata.adGroupId;
                    case(object.taps):
                        tmpObject["clicks"] = object.taps;
                    case(object.localSpend.amount):
                        tmpObject["cost"] = object.localSpend.amount;
                    case(object.impressions):
                        tmpObject["imps"] = object.impressions;
                }   
                responseList.push(tmpObject);
            })
      })
      return responseList;
    }

    processKeywordReport(reportObjs, reportType: string, searchTermReportUrl?: string, marinSingleObjs?: MarinSingleObj[]) {
        const papaparseConfig = {
            header: true,
            transformHeader: (h) => {
                switch (h) {
                    case "date":
                        return "reportDate";
                    case "campaignId":
                        return "campaignid";
                    case "adGroupId":
                        return "adgroupid";
                    case "keywordId":
                        return "criterionid";
                    case "numAdsShown":
                        return "imps";
                    case "numAdsClicks":
                        return "clicks";
                    case "adSpend":
                        return "cost";
                    default:
                        return h;
                }
            }
        }
        const searchTermreportObjs = parse(reportObjs, papaparseConfig).data;
       console.log("searchTermreportObjs", searchTermreportObjs)



        let responseList = []
        reportObjs.forEach(property => {
              property.granularity.forEach(object=>{
                  let tmpObject = {};
                  switch (object) {
                      default:
                      case(object.date):
                          tmpObject["reportDate"] = object.date;
                      case(property.metadata.campaignId):
                          tmpObject["campaignid"] = property.metadata.campaignId;
                      case(property.metadata.adGroupId):
                          tmpObject["adgroupid"] = property.metadata.adGroupId;
                      case(property.metadata.keywordId):
                          tmpObject["criterionid"] = property.metadata.keywordId;
                      case(object.taps):
                          tmpObject["clicks"] = object.taps;
                      case(object.localSpend.amount):
                          tmpObject["cost"] = object.localSpend.amount;
                      case(object.impressions):
                          tmpObject["imps"] = object.impressions;
                  }   
                  responseList.push(tmpObject);
              })
        })
        return responseList;
    }

    processCreativeReport(reportObjs, reportType: string, marinSingleObjs?: MarinSingleObj[]) {
        let responseList = []
        reportObjs.forEach(property => {
              property.granularity.forEach(object=>{
                  let tmpObject = {};
                  switch (object) {
                      default:
                      case(object.date):
                          tmpObject["reportDate"] = object.date;
                      case(property.metadata.campaignId):
                          tmpObject["campaignid"] = property.metadata.campaignId;
                      case(property.metadata.adGroupId):
                          tmpObject["adgroupid"] = property.metadata.adGroupId;
                      case(property.metadata.adId):
                        if (property.metadata.adId < 0){
                            tmpObject["criterionid"] = property.metadata.adGroupId;
                        }
                        else{
                            tmpObject["criterionid"] = property.metadata.adId;
                        }
                      case(object.taps):
                          tmpObject["clicks"] = object.taps;
                      case(object.localSpend.amount):
                          tmpObject["cost"] = object.localSpend.amount;
                      case(object.impressions):
                          tmpObject["imps"] = object.impressions;
                  }   
                  responseList.push(tmpObject);
              })
        })
        return responseList;
    }

    convertNumTypeFieldValues(objs: any[]) {
        for (const obj of objs) {
            for (const key of Object.keys(obj)) {
                if (this.isNumTypeField(key)) {
                    obj[key] = +obj[key];
                }
            }
        }
    }
    
    addCriterionIdField(objs: any[]) {
        for (const obj of objs) {
            obj.criterionid = "";
        }
    }

    isNumTypeField(field: string) {
        const nonConvTypeFields = [
            "reportDate",
            "campaignid",
            "adgroupid",
            "criterionid",
            "keywordId",
            "deviceType"
        ];
        return !nonConvTypeFields.includes(field);
    }
}