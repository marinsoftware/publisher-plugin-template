import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PublisherApiService } from "../services/publisher_api.service";
import { PublisherUtil } from "../services/publisher_utils.service";
import { BadRequest, ReportType, SnapshotService } from './snapshot.service';
import { AdItemsController } from '../items/ad-items.controller';
import { CampaignController } from "../campaigns/campaign.controller"

@Controller('reporting/public/v1.0/report')
export class SnapshotController {
  constructor(
    private readonly publisherService: PublisherApiService,
    private readonly snapshotService: SnapshotService,
    private readonly publisherUtil: PublisherUtil,
    private readonly adItemsController: AdItemsController,
    private readonly campaigncontroller: CampaignController,
  ) {}

  @Get()
  @ApiOperation({summary: 'Get snapshot'})
  @ApiResponse({
    status: 200,
    description: 'Snapshot by accountId, reportDate, and reportType',
    isArray: true
  }) async get(
    @Query('accountId') accountId: number,
    @Query('reportType') reportType: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('refreshToken') refreshToken: string,
    @Query('reportId') reportId?: string,
  ) {
    reportType = this.sanitizeReportType(reportType);
    this.validateReportType(reportType);
    this.validateReportDate(startDate);
    this.validateReportDate(endDate);
    if (!this.snapshotService.isWithinLast90Days(startDate)) {
      throw new HttpException(BadRequest.INVALID_DATE_FORMAT, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    let access_token: string;

    try{
      const response = await this.publisherUtil.refreshAccessToken(refreshToken);
      access_token = response.access_token
    } catch (error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    let reportRes = [];
    let reportRequestParams = {}
    const reportMetrics = this.snapshotService.getReportMetricsByType(reportType);
    reportRequestParams = this.snapshotService.getReportParams(reportType, reportMetrics);
    reportRequestParams["startTime"] = startDate
    reportRequestParams["endTime"] = endDate
    const campaignResponseList = await this.campaigncontroller.get(accountId, refreshToken);
    reportRes = await this.publisherService.getAdAnalyticsResponse(campaignResponseList, reportRequestParams, accountId, access_token, reportType);
    let searchTermReportUrl: string;
    if (reportType == ReportType.KEYWORD){
      if (reportId){
        null;
      }
      const postSnapshotRes: any = await this.publisherService.postSnapshotReport( accountId, access_token, startDate);
      reportId = postSnapshotRes.data.id
      const downloadSnapshotRes: any = await this.publisherService.getSnapshotUrl( accountId, access_token, reportId);
      if (downloadSnapshotRes.data.status != 'COMPLETED'){
        return { reportId: reportId };
      }
      searchTermReportUrl = downloadSnapshotRes.data.downloadUri
    }
    const reportObjs$ = await this.snapshotService.processReportByReportType(reportRes, reportType, accountId, searchTermReportUrl)

    return { data: reportObjs$ };
  }

  validateReportType(reportType: string) {
    if (!this.snapshotService.isValidReportType(reportType)) {
      return new Error(BadRequest.INVALID_REPORT_TYPE);
    }
  }
  
  validateReportDate(reportDate: string) {
    if (!this.snapshotService.isValidDateFormat_yyyy_MM_dd(reportDate)) {
      return new Error(BadRequest.INVALID_DATE_FORMAT);
    }

  }

  sanitizeReportType(reportType: string) {
    switch(reportType) {
      case "group":
        return ReportType.GROUP;
      case "creative":
        return ReportType.ADITEM;
      case "keyword":
        return ReportType.KEYWORD;
      default: 
        return reportType;
    }
  }
}