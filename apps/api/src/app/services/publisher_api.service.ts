import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from "@nestjs/terminus/dist/health-indicator/http/axios.interfaces";
import { environment } from "../../environments/environment";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');
import { transformPublisherAdItems } from "../transformers/object-transformer";
import {
  MarinFailedResponse,
  MarinResponse,
  MarinSingleObj,
  MarinSingleResponse
} from "../models/marin-object.interface";
import { PublisherAdGroup, PublisherKeyword, PublishersAdGroup, PublisherAdItem, PublisherCampaign } from "../models/publisher-objects";
import { forkJoin, map, Observable, retry, lastValueFrom } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import config from "../../../config.helper";
import sendEmail from '../helpers/send-email.helper';
const {execSync} = require('child_process');
import axios from 'axios';
const qs = require('qs');


@Injectable()
export class PublisherApiService {
  apiUrl: string;
  apiUrlv2: string;
  private authSignature: { timestamp: number, signature: string }
  sendEmailInstance: any;
  constructor(private httpService: HttpService) {
    this.apiUrl = environment.ADS_BASE_URL;
    this.apiUrlv2 = config.API_URL_V2;
    this.sendEmailInstance = sendEmail as any;
  }

  /**
   * Gets all campaigns in the Publiser Account
   * @return {Promise<PublisherCampaign[]>}
   * @param advertiserId
   * @param campaignId
   */
  async getPublisherCampaigns(advertiserId: number, campaignId?: number, access_token?: string){
    // Add Remaining publisher hhttp request settings
    const options: AxiosRequestConfig = {
      baseURL: `${this.apiUrl}`,
      method: '{Method-Name}',
      headers: {
        "Content-Type": "{Content-Type}",
      },
    }
    /*
      use campaign id to fetch single camaign according to publisher requirement if sent in request params.
      most publiser support url param
      if campaign id is requred in body then adjust body with campaign Id
      if (campaignId != undefined) {
        options.baseURL = options.baseURL + `/${campaignId}`;
      }
    */  

    try {
      const response = await this.makeHttpCall(options);
      return response;
    } catch(error){
      // send exception message with status 500
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Creates campaigns
   * @param {PublisherKeyword[]} campaigns
   * @param {MarinSingleObj[]} marinCampaign
   * @return  { Observable<MarinResponse | MarinFailedResponse>} Response
   */
  async createCampaigns(campaigns: PublisherCampaign[], marinCampaign: MarinSingleObj[], accountId, access_token) {
    const response = await this.createObjects('campaigns', campaigns, accountId, access_token)
    return this.publisherResponseTranslation(response, marinCampaign, 'campaigns')
  }


    /**
   * Edits campaigns
   * @param campaigns
   * @param {MarinSingleObj[]} marinCampaign
   * @return  { MarinResponse | MarinFailedResponse} Response
   */
    async editPublisherCampaigns(campaigns: PublisherCampaign[], marinCampaign: MarinSingleObj[], accountId?:number, access_token?:string) {
      const response = await this.editPublisherObjects('campaigns', campaigns, accountId, access_token)
      return this.publisherResponseTranslation(response, marinCampaign, 'campaigns');
    }

  /**
   * Delete campaigns
   * @param campaigns
   * @param {MarinSingleObj[]} marinCampaign
   */
  async deleteCampaigns(campaigns: PublisherCampaign[], marinCampaign: MarinSingleObj[], access_token, accountId) {
    const response = await this.deleteObjects('campaigns', access_token, accountId, "objectId",)
    return this.publisherResponseTranslation(response, marinCampaign, 'campaigns');
  }

  /**
   * Delete Adgroups
   * @param adgroups
   * @param {MarinSingleObj[]} marinAdgroup
   */
  async deleteAdgroups(adgroups: PublisherAdGroup[], marinAdgroups: MarinSingleObj[], access_token, accountId) {
    const response = await this.deleteObjects('adgroups', access_token, accountId, "objId")
    return this.publisherResponseTranslation(response, marinAdgroups, 'adgroups');
  }

  /**
   * Delete keywords
   * @param { PublisherKeyword[] } publisherKeywords
   * @param { MarinSingleObj[] } marinKeywords
   * @return  { Observable<MarinResponse | MarinFailedResponse>} Response
   */
  async deleteKeywords(publisherKeywords: PublisherKeyword[], marinKeywords: MarinSingleObj[], accountId:number, access_token:string) {
    const response = await this.deleteObjects('keywords', access_token, accountId, "publisherKeywords.ObjId")
    return this.publisherResponseTranslation(response, marinKeywords, 'keywords');
  }

  publisherResponseTranslation(publisherResponse, marinCampaign: MarinSingleObj[], responseType: string): MarinResponse | MarinFailedResponse {
    /*
      Example: 1
      we are creating 2 campaigns, 1 campaign successfully creates and 1 gets fail we will send back in our response PARTIAL-SUCCESS

      Example: 2
      we are creating 2 campaigns, 2 campaign successfully creates and 0 gets fail we will send back in our response SUCCESS

      Example: 3
      we are creating 2 campaigns, 0 campaign successfully creates and 2 gets fail we will send back in our response Error
    */
    const final: MarinResponse = { requestResult: '', objects: [] };
    let status = '';
    for (let i = 0; i < publisherResponse.length; i++) {
      const currObj: MarinSingleResponse = {details: "", object: undefined, status: ""};
      if (status == 'Error' && !publisherResponse[i].error ||
        status == 'SUCCESS' && publisherResponse[i].error ) {
        status = 'PARTIAL-SUCCESS'
      } else if (publisherResponse[i].data) {
        status = 'SUCCESS';
      }
       else {
        status = 'Error';
      }
      if (publisherResponse[i].data) {
        currObj.status = 'SUCCESS';
      } else {
        currObj.status = 'Error';
        currObj.details = JSON.stringify(publisherResponse[i].error);
      }
      currObj.object = marinCampaign[i];
      if (responseType == 'campaigns' && publisherResponse[i]['data'] && publisherResponse[i]['data'].id != undefined) {
        marinCampaign[i].id = String(publisherResponse[i]['data'].id)
      } else if (responseType == 'adgroups' && publisherResponse[i]['data'] && publisherResponse[i]['data'].id != undefined) {
        marinCampaign[i].id = String(publisherResponse[i]['data'].id)
      } else if (responseType == 'keywords' && publisherResponse[i]['data'][0] && publisherResponse[i]['data'][0].id != undefined) {
        marinCampaign[i].id = String(publisherResponse[i]['data'][0].id)
      } else if (responseType == 'adItems' && publisherResponse[i]['data'] && publisherResponse[i]['data'].id != undefined) {
        marinCampaign[i].id = String(publisherResponse[i]['data'].id)
      }
      final.objects.push(currObj)
    }
    final.requestResult = status;
    return final;

  }

  responseTranslation(response: Observable<any[]>, marinCampaign: MarinSingleObj[], responseType: string): Observable<MarinResponse | MarinFailedResponse> {
    const final: MarinResponse = { requestResult: '', objects: [] };
    return response.pipe(map(publisherCampaignResponse => {
      let status = '';
      for (let i = 0; i < publisherCampaignResponse.length; i++) {
        const currObj: MarinSingleResponse = {details: "", object: undefined, status: ""};
        if (status == 'Error' && publisherCampaignResponse[i].code == 'success' ||
          status == 'SUCCESS' && publisherCampaignResponse[i].code == 'failure') {
          status = 'PARTIAL-SUCCESS'
        } else if (publisherCampaignResponse[i].code == 'success') {
          status = 'SUCCESS';
        } else {
          status = 'Error';
        }

        if (publisherCampaignResponse[i].code == 'success') {
          currObj.status = 'SUCCESS';
        } else {
          currObj.status = 'Error';
          currObj.details = publisherCampaignResponse[i].details;
        }
        currObj.object = marinCampaign[i];
        if (responseType == 'campaign' && publisherCampaignResponse[i].campaignId != undefined) {
          marinCampaign[i].id = String(publisherCampaignResponse[i].campaignId)
        } else if (responseType == 'adGroup' && publisherCampaignResponse[i].adGroupId != undefined) {
          marinCampaign[i].id = String(publisherCampaignResponse[i].adGroupId)
        } else if (responseType == 'adItem' && publisherCampaignResponse[i].adItemId != undefined) {
          marinCampaign[i].id = String(publisherCampaignResponse[i].adItemId)
        } else if (responseType == 'sba_profile' && publisherCampaignResponse[i].sbaProfileId != undefined && publisherCampaignResponse[i].sbaProfileId != 0) {
          marinCampaign[i].id = String(publisherCampaignResponse[i].sbaProfileId)
        }

        final.objects.push(currObj)
      }
      final.requestResult = status;
      return final;
    }))
  }

  /**
   * Gets adgroups in the Apple Account
   * @return {Promise<PublisherCampaign[]>}
   * @param advertiserId
   * @param campaignId
   */
  async getPublisherAdGroup(advertiserId : number, access_token: string, campaignId, adgroupId){
    const options: AxiosRequestConfig = {
      baseURL: `${this.apiUrl}campaigns/${campaignId}/adgroups/${adgroupId}`,
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
        "X-AP-Context": `orgId=${advertiserId}`,
      },
    }
    try {
      const response = await this.makeHttpCall(options);
      return response;
    } catch(error){
      console.log("options", options);
      console.log("error", error);
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Gets adgroups in the Apple Account
   * @return {Promise<PublisherCampaign[]>}
   * @param advertiserId
   * @param campaignId
   */
  async getPublisherAdGroups(advertiserId : number, access_token: string, campaignId?: string, offset?:number){
    const options: AxiosRequestConfig = {
      baseURL: `${this.apiUrl}/adroups`,
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
      },
    }
    const response = await this.makeHttpCall(options);
    return response;
  }


  /**
   * Gets keywords in the Publisher Account
   * @return {Promise<PublisherCampaign[]>}
   * @param advertiserId
   * @param campaignId
   */
  async getPublisherKeywords(advertiserId : number, access_token: string, campaignId?: string, adgroupId?: string, offset?:number){
    const options: AxiosRequestConfig = {
      baseURL: `${this.apiUrl}/keywords?offset=${offset}&limit=${environment.limit}`,
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
      },
    }
    const response = await this.makeHttpCall(options);
    return response;

  }



  /**
   * Creates Addgroups
   * @param {PublisherAdGroup[]} adGroups
   * @param marinAdGroup
   */
  async createAdGroups(adGroups: PublisherAdGroup[], marinAdGroup: MarinSingleObj[], accountId:number, access_token: string) {
    const response = await this.createObjects('adgroups', adGroups, accountId, access_token)
    return this.publisherResponseTranslation(response, marinAdGroup, 'adgroups');
  }

  /**
   * Edits AdGroups
   * @param {adGroups[]} adGroups
   * @param marinAdGroup
   */
  async editAdGroups(adGroups: PublisherAdGroup[], marinAdGroup: MarinSingleObj[], accountId: number, access_token: string) {
    const response = await this.editPublisherObjects('adgroups', adGroups, accountId, access_token)
    return this.publisherResponseTranslation(response, marinAdGroup, 'adgroups');
  }

  /**
   * Creates keywords
   * @param { PublisherCampaign[] } publisherKeywords
   * @param { MarinSingleObj[] } marinKeywords
   * @return  { Observable<MarinResponse | MarinFailedResponse>} Response
   */
  async createKeywords(publisherKeywords: PublisherKeyword[], marinKeywords: MarinSingleObj[], accountId:number, access_token:string) {
    const response = await this.createObjects('keywords', publisherKeywords, accountId, access_token)
    return this.publisherResponseTranslation(response, marinKeywords, 'keywords');
  }

  /**
   * Edits keywords
   * @param { PublisherKeyword[] } publisherKeywords
   * @param { MarinSingleObj[] } marinKeywords
   * @return  { Observable<MarinResponse | MarinFailedResponse>} Response
   */
  async editKeywords(publisherKeywords: PublisherKeyword[], marinKeywords: MarinSingleObj[], publisherAdgroupResponse:any[], accountId:number, access_token:string) {
    const response = await this.editPublisherObjects('keywords', publisherKeywords, accountId, access_token)
    return this.publisherResponseTranslation(response, marinKeywords, 'keywords');
  }


  async getPublisherAdItems(advertiserId : number, access_token: string, campaignId? : string, adGroupId? : string, offset?: number){
    const options: AxiosRequestConfig = {
      baseURL: `${this.apiUrl}/ads?limit=${environment.limit}`,
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
        "X-AP-Context": `orgId=${advertiserId}`,
      },
    }
    const response = await this.makeHttpCall(options);
    return response;

  }


  async getPublisherPin(advertiserId : number, adList, access_token: string){
    const options: AxiosRequestConfig = {
      baseURL: '',
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`
      },
      params: {}
    }
    for (let i = 0; i < adList.length; i++){
      options.baseURL = `${this.apiUrl}pins/` + adList[i].pin_id;
      let pinResponse;
      try{
        pinResponse = await this.makeHttpCall(options);
      } catch(error){
        continue;
      }
      adList[i].link = pinResponse['link']
      adList[i].title = pinResponse['title']
      adList[i].description = pinResponse['description']
    }
    return adList

  }

  /**
   * Create AdItems
   * @return  { Observable<MarinResponse | MarinFailedResponse>} Response
   * @param adItems
   * @param marinAdItem
   */
  async createAdItem(adItems: PublisherAdItem[], marinAdItem: MarinSingleObj[], accountId:number, access_token:string) {
    const response = await this.createObjects('adItems', adItems, accountId, access_token)
    return this.publisherResponseTranslation(response, marinAdItem, 'adItems');
  }

  /**
   * Edits adItem
   * @param adItems
   * @param {MarinSingleObj[]} marinAdItem
   * @return  { Observable<MarinResponse | MarinFailedResponse>} Response
   */
  async editAdItem(adItems: PublisherAdItem[], marinAdItem: MarinSingleObj[], accountId: number, token: string) {
    const response = await this.editPublisherObjects('adItems', adItems, accountId, token)
    return this.publisherResponseTranslation(response, marinAdItem, 'adItems');
  }

    /**
   * Edits adItem
   * @param deleteadItems
   * @param {MarinSingleObj[]} marinAdItem
   * @return  { Observable<MarinResponse | MarinFailedResponse>} Response
   */
    async deleteAdItem(adItems: PublisherAdItem[], marinAdItem: MarinSingleObj[], accountId: number, token: string) {
      const response = await this.deleteObjects('adItems', token, accountId, "objId")
      return this.publisherResponseTranslation(response, marinAdItem, 'adItems');
    }
    
  getItemSearch(itemSearchRequest) {
    const options: AxiosRequestConfig = {
      baseURL: this.apiUrl + 'itemSearch',
      method: 'POST',
      headers: {},
      params: {},
      data: itemSearchRequest
    }
    return this.makeHttpCall(options);
  }


  async getAdAnalyticsResponse(campaignobjList, requestParams, accountId, access_token, reportType){
      let reportRes = [];
      for (let index = 0; index < campaignobjList.length; index++){
        let response:any = await this.getSnapshot(accountId, access_token, requestParams, campaignobjList[index], reportType);
        if ("data" in response){
          reportRes.push(...response['data']['reportingDataResponse']['row']);
        }
      }
      return reportRes
  }


  async getSnapshot(advertiserId: number, access_token: string, requestParams, campaignobj, reportType) {
    const options: AxiosRequestConfig = {
      baseURL: `${this.apiUrl}reports/campaigns/${campaignobj.id}/adgroups`,
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
        "X-AP-Context": `orgId=${advertiserId}`
      },
      data: requestParams
    }
    if (reportType == "creative"){
      options.baseURL = `${this.apiUrl}reports/campaigns/${campaignobj.id}/ads`
    } else if (reportType == "keyword"){
      options.baseURL = `${this.apiUrl}reports/campaigns/${campaignobj.id}/keywords`
    }
    try {
      const response = await this.makeHttpCall(options);
      return response;
    } catch(error){
      return []
    }
  }

  async postSnapshotReport(advertiserId: number, access_token: string, startDate) {
    const options: AxiosRequestConfig = {
      baseURL: `${this.apiUrl}custom-reports`,
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
        "X-AP-Context": `orgId=${advertiserId}`
      },
      data: { "name": "impression_share_API_report", "startTime": startDate, "endTime": startDate, "granularity": "DAILY"}
    }
    try {
      const response = await this.makeHttpCall(options);
      return response;
    } catch(error){
      return null;
    }
  }  

  async getSnapshotUrl(advertiserId: number, access_token: string, reportId) {
    const options: AxiosRequestConfig = {
      baseURL: `${this.apiUrl}custom-reports/${reportId}`,
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
        "X-AP-Context": `orgId=${advertiserId}`
      },
    }
    try {
      const response = await this.makeHttpCall(options);
      return response;
    } catch(error){
      return null;
    }
  }

  /**
   * Creates objects
   * @param {string} objectType
   * @param {any[]} objects
   */
  async createObjects(objectType:string, objects, accountId, access_token, campaignId?, adgroupId?) {
    // Add Remaining publisher http request settings if needed
    const options: AxiosRequestConfig = {
      baseURL: `${this.apiUrl}/${objectType}`,
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
      },
      data: objects
    }
    const response = await this.makeHttpCall(options);
    return response;
  }

 /**
   * Edits objects
   * @param objectType
   * @param {any[]} objects
   */
  async editPublisherObjects(objectType: string, objects, accountId, access_token, campaignId?, adgroupId?, adId?) {
    const options: AxiosRequestConfig = {
      baseURL: `${this.apiUrl}/${objectType}`,
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
      },
      data: objects
    }
    const response = await this.makeHttpCall(options);
    return response;
  }

  /**
   * Delete objects
   * @param objectType
   * @param {any[]} objects
   */
  async deleteObjects(objectType: string, access_token: string, accountId, Id?) {
    const options: AxiosRequestConfig = {
      baseURL: `${this.apiUrl}/${accountId}/${objectType}/${Id}`,
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
      }
    }
    const response = await this.makeHttpCall(options);
    return response;
  }

  /**
   * Downloads a snapshot report
   * @param {string} detailsUrl
   */
  downloadReport(detailsUrl: string) {
    const options: AxiosRequestConfig = {
      method: 'GET',
      baseURL: detailsUrl,
      headers: {},
      params: {}
    }
    return this.makeHttpCall(options);
  }

  valueToString (value: any) {
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    return value;
  }

  makeHttpCall(options: AxiosRequestConfig){
    return new Promise((resolve, reject) => {
      axios(options)
        .then(res => {
          resolve(res.data)
        })
        .catch(error => {
          if(error.response && 'data' in error.response){
            reject(error.response.data)
          } else{
            console.log("error", error);
            reject(error.response)
          }
        });
    })
  }

}
