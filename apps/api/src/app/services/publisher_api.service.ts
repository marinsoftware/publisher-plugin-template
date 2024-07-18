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
   * Gets all campaigns in the Apple Account
   * @return {Promise<PublisherCampaign[]>}
   * @param advertiserId
   * @param campaignId
   */
  async getPublisherCampaigns(advertiserId : number, campaignId? : number, offset?:number, access_token?:string){
    const options: AxiosRequestConfig = {
      baseURL: `${this.apiUrl}campaigns`,
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
        "X-AP-Context": `orgId=${advertiserId}`,
      },
    }

    if (campaignId != undefined) {
      options.baseURL = options.baseURL + `/${campaignId}`;
    } else {
      options.baseURL = options.baseURL + `?offset=${offset}&limit=${environment.limit}`;
    }
    try {
      const response = await this.makeHttpCall(options);
      return response;
    } catch(error){
      throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Gets all campaigns in the Publisher Account
   * @return {Promise<PublisherCampaign[]>}
   * @param advertiserId
   * @param campaignId
   */
  getCampaigns(advertiserId : number, campaignId? : number): Observable<PublisherCampaign[]> {
    /*TODO Need to add filtering Feature*/
    const options: AxiosRequestConfig = {
      baseURL: this.apiUrl + 'campaigns',
      method: 'GET',
      headers: {},
      params: {}
    }
    if (campaignId != undefined) {
      options.params['campaignId'] = campaignId;
    }
    return this.makeApiCall(options);
  }

  /**
   * Creates campaigns
   * @param {PublisherKeyword[]} campaigns
   * @param {MarinSingleObj[]} marinCampaign
   * @return  { Observable<MarinResponse | MarinFailedResponse>} Response
   */
  async createCampaigns(campaigns: PublisherCampaign[], marinCampaign: MarinSingleObj[], accountId, access_token) {
    // return this.responseTranslation(this.createObjects('campaign', campaigns), marinCampaign, 'campaign');
    let campaignList = []
    for (let index = 0 ; index < campaigns.length; index++){
      let response;
      try{
        response = await this.createObjects('campaigns', campaigns[index], accountId, access_token)
      }catch(e){
        console.log("create campaign>>>>",e.error);
        response = { data: null, pagination: null, error: { errors: e.error } }
      }
      campaignList.push(response);
    }
    return this.publisherResponseTranslation(campaignList, marinCampaign, 'campaigns')
  }

  /**
   * Edits campaigns
   * @param campaigns
   * @param {MarinSingleObj[]} marinCampaign
   * @return  { Observable<MarinResponse | MarinFailedResponse>} Response
   */
  editCampaigns(campaigns: PublisherCampaign[], marinCampaign: MarinSingleObj[]) {
    return this.responseTranslation(this.editObjects('campaign', campaigns), marinCampaign, 'campaign');
  }

    /**
   * Edits campaigns
   * @param campaigns
   * @param {MarinSingleObj[]} marinCampaign
   * @return  { MarinResponse | MarinFailedResponse} Response
   */
    async editPublisherCampaigns(campaigns: PublisherCampaign[], marinCampaign: MarinSingleObj[], accountId?:number, access_token?:string) {
      let campaignList = []
      for (let index = 0 ; index < campaigns.length; index++){
        let response;
        try{
          response = await this.editPublisherObjects('campaigns', campaigns[index], accountId, access_token, campaigns[index].id)
        }catch(e){
          console.log(">>editPublisherObjects<<<",e.error);
          response = { data: null, pagination: null, error: { errors: e.error } }
        }
        campaignList.push(response);
      }
      return this.publisherResponseTranslation(campaignList, marinCampaign, 'campaigns');
    }

  /**
   * Delete campaigns
   * @param campaigns
   * @param {MarinSingleObj[]} marinCampaign
   */
  async deleteCampaigns(campaigns: PublisherCampaign[], marinCampaign: MarinSingleObj[], access_token, accountId) {
    let campaignList = []
    for (let index = 0 ; index < campaigns.length; index++){
      let response;
      try {
        response = await this.deleteObjects('campaigns', access_token, accountId, campaigns[index].id)
        response['data'] = campaigns[index];
      }catch(e){
        response = { data: null, pagination: null, error: { errors: e.error } }
      }
      campaignList.push(response);
    }
    return this.publisherResponseTranslation(campaignList, marinCampaign, 'campaigns');
  }

  /**
   * Delete Adgroups
   * @param adgroups
   * @param {MarinSingleObj[]} marinAdgroup
   */
  async deleteAdgroups(adgroups: PublisherAdGroup[], marinAdgroups: MarinSingleObj[], access_token, accountId) {
    let adgroupList = []
    for (let index = 0 ; index < adgroups.length; index++){
      let response;
      try {
        response = await this.deleteObjects('adgroups', access_token, accountId, adgroups[index].campaignId, adgroups[index].id)
        response['data'] = adgroups[index];
      }catch(e){
        response = { data: null, pagination: null, error: { errors: e.error } }
      }
      adgroupList.push(response);
    }
    return this.publisherResponseTranslation(adgroupList, marinAdgroups, 'adgroups');
  }

  /**
   * Delete keywords
   * @param { PublisherKeyword[] } publisherKeywords
   * @param { MarinSingleObj[] } marinKeywords
   * @return  { Observable<MarinResponse | MarinFailedResponse>} Response
   */
  async deleteKeywords(publisherKeywords: PublisherKeyword[], marinKeywords: MarinSingleObj[], publisherAdgroupResponse:any[], accountId:number, access_token:string) {
    let keywordResponseList = []
    for (let index=0; index < publisherKeywords.length; index++){
      const adgroupObj = publisherAdgroupResponse.find((obj) => {
        return obj.id === publisherKeywords[index].adGroupId;
      });
      let response;
      try{
        response = await this.deleteObjects('keywords', access_token, accountId, adgroupObj.campaignId, adgroupObj.id, publisherKeywords[index].id)
        response['data'] = publisherKeywords[index];
      }catch(e){
        response = { data: null, pagination: null, error: { errors: e.error } }
      }
      keywordResponseList.push(response)
    }
    
    return this.publisherResponseTranslation(keywordResponseList, marinKeywords, 'keywords');
  }

  publisherResponseTranslation(publisherResponse, marinCampaign: MarinSingleObj[], responseType: string): MarinResponse | MarinFailedResponse {
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
      baseURL: `${this.apiUrl}campaigns/${campaignId}/adgroups?offset=${offset}&limit=${environment.limit}`,
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
      return {
        "data": []
      }
    }
  }

  /**
   * Gets all ad groups in the Publisher Account
   * @return {Promise<PublisherAdGroup[]>}
   * @param advertiserId
   * @param campaignId
   * @param adGroupId
   */
  getAdGroups(advertiserId : number, campaignId? : number, adGroupId? : number): Observable<PublishersAdGroup[]> {
    /*TODO Need to add filtering Feature*/
    const options: AxiosRequestConfig = {
      baseURL: this.apiUrl + 'adGroups',
      method: 'GET',
      headers: {},
      params: {}
    }
    options.params['advertiserId'] = advertiserId;
    if (campaignId != undefined) {
      options.params['campaignId'] = campaignId;
    }
    if (adGroupId != undefined) {
      options.params['adGroupId'] = adGroupId;
    }
    return this.makeApiCall(options);
  }


  /**
   * Gets keywords in the Publisher Account
   * @return {Promise<PublisherCampaign[]>}
   * @param advertiserId
   * @param campaignId
   */
  async getPublisherKeywords(advertiserId : number, access_token: string, campaignId: string, adgroupId: string, offset:number){
    const options: AxiosRequestConfig = {
      baseURL: `${this.apiUrl}campaigns/${campaignId}/adgroups/${adgroupId}/targetingkeywords?offset=${offset}&limit=${environment.limit}`,
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
      return {"data": []}
      // throw new HttpException(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  /**
   * Creates Addgroups
   * @param {PublisherAdGroup[]} adGroups
   * @param marinAdGroup
   */
  async createAdGroups(adGroups: PublisherAdGroup[], marinAdGroup: MarinSingleObj[], accountId:number, access_token: string) {
    let publisherResponseList = []
    for (let index = 0 ; index < adGroups.length; index++){
      let response:any;
      try{
        response = await this.createObjects('adgroups', adGroups[index], accountId, access_token, adGroups[index].campaignId)
      }catch(e){
        console.log("createAdGroups groups>>>>",e.error);
        response = { data: null, pagination: null, error: { errors: e } }
      }
      publisherResponseList.push(response);
    }
    return this.publisherResponseTranslation(publisherResponseList, marinAdGroup, 'adgroups');
  }

  /**
   * Edits AdGroups
   * @param {adGroups[]} adGroups
   * @param marinAdGroup
   */
  async editAdGroups(adGroups: PublisherAdGroup[], marinAdGroup: MarinSingleObj[], accountId: number, access_token: string) {
    let publisherResponseList = []
    for (let index = 0 ; index < adGroups.length; index++){
      let response;
      try{
        response = await this.editPublisherObjects('adgroups', adGroups[index], accountId, access_token, adGroups[index].campaignId, adGroups[index].id)
      }catch(e){
        console.log("editAdGroups groups>>>>",e.error);
        response = { data: null, pagination: null, error: { errors: e.error } }
      }
      publisherResponseList.push(response);
    }
    
    return this.publisherResponseTranslation(publisherResponseList, marinAdGroup, 'adgroups');
  }

  /**
   * Creates keywords
   * @param { PublisherCampaign[] } publisherKeywords
   * @param { MarinSingleObj[] } marinKeywords
   * @return  { Observable<MarinResponse | MarinFailedResponse>} Response
   */
  async createKeywords(publisherKeywords: PublisherKeyword[], marinKeywords: MarinSingleObj[], publisherAdgroupResponse:any[], accountId:number, access_token:string) {
    let keywordResponseList = []
    for (let index=0; index < publisherKeywords.length; index++){
      const adgroupObj = publisherAdgroupResponse.find((obj) => {
        return obj.id === publisherKeywords[index].adGroupId;
      });
      let response;
      try{
        response = await this.createObjects('keywords', publisherKeywords[index], accountId, access_token, adgroupObj.campaignId, adgroupObj.id)
      }catch(e){
        response = { data: null, pagination: null, error: { errors: e.message } }
      }
      keywordResponseList.push(response)
    }
    return this.publisherResponseTranslation(keywordResponseList, marinKeywords, 'keywords');
  }

  /**
   * Edits keywords
   * @param { PublisherKeyword[] } publisherKeywords
   * @param { MarinSingleObj[] } marinKeywords
   * @return  { Observable<MarinResponse | MarinFailedResponse>} Response
   */
  async editKeywords(publisherKeywords: PublisherKeyword[], marinKeywords: MarinSingleObj[], publisherAdgroupResponse:any[], accountId:number, access_token:string) {
    let keywordResponseList = []
    for (let index=0; index < publisherKeywords.length; index++){
      const adgroupObj = publisherAdgroupResponse.find((obj) => {
        return obj.id === publisherKeywords[index].adGroupId;
      });
      let response;
      try{
        response = await this.editPublisherObjects('keywords', publisherKeywords[index], accountId, access_token, adgroupObj.campaignId, adgroupObj.id)
      }catch(e){
        response = { data: null, pagination: null, error: { errors: e.error } }
      }
      keywordResponseList.push(response)
    }
    
    return this.publisherResponseTranslation(keywordResponseList, marinKeywords, 'keywords');
  }


  async getPublisherAdItems(advertiserId : number, access_token: string, campaignId : string, adGroupId : string, offset: number){
    const options: AxiosRequestConfig = {
      baseURL: `${this.apiUrl}campaigns/${campaignId}/adgroups/${adGroupId}/ads?offset=${offset}&limit=${environment.limit}`,
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
      console.log("error", error);
      return {"data": []};
    }
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
  getAdItems(filter?: object, publisherCampaigns?: PublisherCampaign[]) {
    const observableList = publisherCampaigns.map((data: PublisherCampaign) => {
      if(data.id) {
        const options: AxiosRequestConfig = {
          baseURL: this.apiUrl + 'adItems',
          method: 'GET',
          headers: {},
          params: {'campaignId': data.id}
        };
        console.log("get ad items for campaign ", data.id);
        execSync('sleep 0.1');
        return this.makeApiCall(options);
      }
    });
    return forkJoin(observableList).pipe(map(adItems => transformPublisherAdItems(adItems.flat(1))));
  }

  getBrandProfileItems(filter?: object, publisherAdgroups?: PublishersAdGroup[]) {
    const observableList = publisherAdgroups.map((data: PublishersAdGroup) => {
      if(data.campaignId) {
        const options: AxiosRequestConfig = {
          baseURL: this.apiUrlv2 + 'sba_profile',
          method: 'GET',
          headers: {},
          params: { 'campaignId': data.campaignId, 'adGroupId': data.id }
        };
        return this.makeApiCall(options);
      }
    });
    return forkJoin(observableList).pipe(map(adItems => transformPublisherAdItems(adItems.flat(1))));
  }


  /**
   * Gets all ad groups in the Publisher Account
   * @return {Promise<PublisherAdGroup[]>}
   * @param campaignId
   */
  getAdItem(campaignId : number): Observable<PublisherAdItem[]> {
    /**
     * TODO Need to add filtering Feature
     */
    const options: AxiosRequestConfig = {
      baseURL: this.apiUrl + 'adItems',
      method: 'GET',
      headers: {},
      params: {}
    }
    options.params['campaignId'] = campaignId;

    return this.makeApiCall(options);
  }

  /**
   * Gets all ad groups in the Publisher Account
   * @return {Promise<PublisherAdGroup[]>}
   * @param campaignId
   */
  getSbaProfileItem(campaignId : number, adgroupId : number): Observable<PublisherAdItem[]> {
    /**
     * TODO Need to add filtering Feature
     */
    const options: AxiosRequestConfig = {
      baseURL: this.apiUrlv2 + 'sba_profile',
      method: 'GET',
      headers: {},
      params: {'campaignId':campaignId, 'adGroupId':adgroupId}
    }

    return this.makeApiCall(options);
  }

  /**
   * Create AdItems
   * @return  { Observable<MarinResponse | MarinFailedResponse>} Response
   * @param adItems
   * @param marinAdItem
   */
  async createAdItem(adItems: PublisherAdItem[], marinAdItem: MarinSingleObj[], publisherAdgroupList:any[], accountId:number, access_token:string) {
    
    let AdItemResponseList = []
    for (let index=0; index < adItems.length; index++){
      const adgroupObj = publisherAdgroupList.find((obj) => {
        return obj.id == adItems[index].adGroupId;
      });
      let response;
      try{
        response = await this.createObjects('adItems', adItems[index], accountId, access_token, adgroupObj.campaignId, adgroupObj.id)
      }catch(e){
        response = { data: null, pagination: null, error: { errors: e.message } }
      }
      AdItemResponseList.push(response)
    }
    return this.publisherResponseTranslation(AdItemResponseList, marinAdItem, 'adItems');
  }

  /**
   * Edits adItem
   * @param adItems
   * @param {MarinSingleObj[]} marinAdItem
   * @return  { Observable<MarinResponse | MarinFailedResponse>} Response
   */
  async editAdItem(adItems: PublisherAdItem[], marinAdItem: MarinSingleObj[], publisherAdgroupList, accountId: number, token: string) {
    let AdItemResponseList = []
    for (let index=0; index < adItems.length; index++){
      const adgroupObj = publisherAdgroupList.find((obj) => {
        return obj.id == adItems[index].adGroupId;
      });
      let response;
      try{
        response = await this.editPublisherObjects('adItems', adItems[index], accountId, token, adgroupObj.campaignId, adgroupObj.id, adItems[index].id)
      }catch(e){
        response = { data: null, pagination: null, error: { errors: e.message } }
      }
      AdItemResponseList.push(response)
    }
    return this.publisherResponseTranslation(AdItemResponseList, marinAdItem, 'adItems');
  }

    /**
   * Edits adItem
   * @param deleteadItems
   * @param {MarinSingleObj[]} marinAdItem
   * @return  { Observable<MarinResponse | MarinFailedResponse>} Response
   */
    async deleteAdItem(adItems: PublisherAdItem[], marinAdItem: MarinSingleObj[], publisherAdgroupList, accountId: number, token: string) {
      let AdItemResponseList = []
      for (let index=0; index < adItems.length; index++){
        const adgroupObj = publisherAdgroupList.find((obj) => {
          return obj.id == adItems[index].adGroupId;
        });
        let response;
        try{
          response = await this.deleteObjects('adItems', token, accountId, adgroupObj.campaignId, adgroupObj.id, adItems[index].id)
          response['data'] = adItems[index]
        }catch(e){
          response = { data: null, pagination: null, error: { errors: e.message } }
        }
        AdItemResponseList.push(response)
      }
      return this.publisherResponseTranslation(AdItemResponseList, marinAdItem, 'adItems');
    }
    
  getItemSearch(itemSearchRequest) {
    const options: AxiosRequestConfig = {
      baseURL: this.apiUrl + 'itemSearch',
      method: 'POST',
      headers: {},
      params: {},
      data: itemSearchRequest
    }
    return this.makeApiCall(options);
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
      // console.log(`${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
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
    const options: AxiosRequestConfig = {
      baseURL: `${this.apiUrl}`,
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
        "X-AP-Context": `orgId=${accountId}`,
      },
      data: objects
    }
    switch (objectType){
      case "campaigns":
        options.baseURL = options.baseURL + objectType;
        break;
      case "adgroups":
        options.baseURL = `${options.baseURL}campaigns/${campaignId}/${objectType}`;
        break;
      case "keywords":
        options.baseURL = `${options.baseURL}campaigns/${campaignId}/adgroups/${adgroupId}/targetingkeywords/bulk`;
        options.data = [objects];
        break;
      case "adItems":
        options.baseURL = `${options.baseURL}campaigns/${campaignId}/adgroups/${adgroupId}/ads`;
        break;
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
      baseURL: `${this.apiUrl}`,
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
        "X-AP-Context": `orgId=${accountId}`,
      },
      data: objects
    }
    switch (objectType){
      case "campaigns":
        options.baseURL = options.baseURL + objectType + `/${campaignId}`;
        delete objects.id;
        options.data = {"campaign": objects};
        break;
      case "adgroups":
        options.baseURL = `${options.baseURL}campaigns/${campaignId}/${objectType}/${adgroupId}`;
        delete objects.id;
        delete objects.campaignId;
        options.data = objects
        break;
      case "keywords":
        options.baseURL = `${options.baseURL}campaigns/${campaignId}/adgroups/${adgroupId}/targetingkeywords/bulk`;
        options.data = [objects];
        break;
        case "adItems":
          options.baseURL = `${options.baseURL}campaigns/${campaignId}/adgroups/${adgroupId}/ads/${adId}`;
          break;
    }
    console.log("options", options)
    const response = await this.makeHttpCall(options);
    return response;
  }



  /**
   * Edits objects
   * @param objectType
   * @param {any[]} objects
   */
  editObjects(objectType: string, objects) {
    const endpoint = objectType == 'sba_profile'? objectType : objectType + 's';
    if (Array.isArray(objects) && objects.length > 0) {
      if (endpoint.includes("campaign")){
        let batch_list = []
        for (let index=0; index < objects.length; index+=environment.batchLimit){
          batch_list.push(objects.slice(index, index+environment.batchLimit))
        }
        const observableList = batch_list.map((data: PublisherCampaign[]) => {
            const options: AxiosRequestConfig = {
              baseURL: this.apiUrl + endpoint,
              method: 'POST',
              data: data,
              headers: {},
              params: {}
            };
            return this.makeApiCall(options);
        });
        return forkJoin(observableList).pipe(map(response => response.flat()));
      } else {
        const options: AxiosRequestConfig = {
          method: 'PUT',
          baseURL: objectType == 'sba_profile'? this.apiUrlv2 + endpoint : this.apiUrl + endpoint,
          data: objects,
          headers: {},
          params: {}
        }
        return this.makeApiCall(options);
      }
    }
  }

  /**
   * Delete objects
   * @param objectType
   * @param {any[]} objects
   */
  async deleteObjects(objectType: string, access_token, accountId, campaignId, adgroupId?, keywordId?, adId?) {
    const options: AxiosRequestConfig = {
      baseURL: `${this.apiUrl}`,
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
        "X-AP-Context": `orgId=${accountId}`,
      }
    }
    switch (objectType){
      case "campaigns":
        options.baseURL = options.baseURL + objectType + `/${campaignId}`;
        break;
      case "adgroups":
        options.baseURL = `${options.baseURL}campaigns/${campaignId}/${objectType}/${adgroupId}`;
        break;
      case "keywords":
        options.baseURL = `${options.baseURL}campaigns/${campaignId}/adgroups/${adgroupId}/targetingkeywords/${keywordId}`;
        break;
      case "adItems":
        options.baseURL = `${options.baseURL}campaigns/${campaignId}/adgroups/${adgroupId}/ads/${adId}`;
        break;
    }
    console.log("options", options)
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
    return this.makeApiCall(options);
  }

  getOptions(options:any){
    const token_time_stamp_seconds = this.authSignature.timestamp/1000;
    const current_time_stamp_seconds = Math.round(+new Date()/1000) - 295 ;
    if (current_time_stamp_seconds > token_time_stamp_seconds)
    {
      this.authSignature = this.generateAuthSignature();
      options.headers['wm_consumer.intimestamp'] = this.authSignature.timestamp;
      options.headers['wm_sec.auth_signature'] = this.authSignature.signature;
    }
    return options
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



  makeApiCall(options: AxiosRequestConfig): Observable<any> {
    if (!this.authSignature) {
      this.authSignature = this.generateAuthSignature();
    }
    options.headers = {
      'wm_consumer.id' : config.CONSUMER_ID,
      'wm_sec.key_version' : '1',
      'wm_consumer.intimestamp' : this.authSignature.timestamp,
      'wm_sec.auth_signature' : this.authSignature.signature
    }
    options.params['auth_token'] = config.AUTH_TOKEN;

    return this.httpService.request(this.getOptions(options)).pipe(
      tap(() => {
        console.log('HTTP request invoked ...', this.getOptions(options));
      }),
      map(val => {
        if (val.status >= 400) {
          this.authSignature = this.generateAuthSignature();
          throw new HttpException(`Received status ${val.status} from HTTP call`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return val.data;
      }),
      retry(5),
      catchError(err => {
        console.log("err--->", err);
        const data = {'type': 'Error', 'details': err.response.statusText}
        if (err.response.status == 404){
          return [null];
        }
        else if (err.response.status == 429){
          data.details = 'Api operations limit breached for 60 Minutes interval';
          this.sendEmailInstance.sendEmail({
            toEmail: [config.LIMIT_BREACHED_EMAIL_TO],
            subject: 'Publisher API Operations Limit Breached ❌',
            textBody: `server ${err.message}. ${data.details}`,
          });
        }
        throw new HttpException(data, HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );

  }

  /**
   * generate Publisher auth signature
   * @private
   * @return {object} auth signature
   */
  generateAuthSignature() {
    const unix = Math.round(+new Date()/1000) * 1000;
    const data = config.CONSUMER_ID + '\n' + unix.toString() + '\n' + '1' + '\n';
    const signer = crypto.createSign('RSA-SHA256').update(data);
    return {
      timestamp: unix,
      signature: signer.sign(
         config.API_URL.includes('stg.publisher') ? environment.privateKey :  environment.privateKeyPoduction,
        'base64'
      )
    };
  }

}
