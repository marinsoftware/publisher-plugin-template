import { Injectable, Logger } from '@nestjs/common';
import config from './../../../../config.helper';
import { remote_post, remote_get } from './remote_call';
import { environment } from "../../../environments/environment";

const qs = require('qs');

@Injectable()
export class PublisherUtil {
  appId: string;
  secret: string;
  baseUrl: string;
  redirectUrl: string;
  oauthBaseUrl: string;
  constructor() {
    this.appId = config.APP_ID;
    this.secret = config.SECRET_ADS;
    this.baseUrl = environment.ADS_BASE_URL;
    this.oauthBaseUrl = environment.AUTH_BASE_URL;
    this.redirectUrl = config.REDIRECT_URI;
  }
  async getPublisherToken(code: string, serviceType: string){
    const postData = {
      "client_id": this.appId,
      "client_secret": this.secret,
      "grant_type": "authorization_code",
      "code": code,
      "redirect_uri":config.REDIRECT_URI
    };
    let axios_config = {
      method: 'POST',
      url: this.oauthBaseUrl+"auth/oauth2/token",
      data: qs.stringify(postData),
    };
    const response: any = await remote_post(axios_config);
    return JSON.parse(response);
  }

  async getAdAccountDetail(account_name: string, account_id: string, access_token: string){
    let axios_config = {
      method: 'GET',
      url: `${this.baseUrl}acls`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
      }
    };
    const response_accounts: any = await remote_get(axios_config);
    const accounts = JSON.parse(response_accounts);
    if (accounts && 'data' in accounts){
      for(const account of accounts['data']) {
        if (account['orgId'] == account_id){
          return account;
        }
      }
    }
  }

  async refreshAccessToken(refresh_token: string){ 
    const postData = {
      "client_id": this.appId,
      "client_secret": this.secret,
      "grant_type": "refresh_token",
      "refresh_token": refresh_token
    };
    const axios_config = {
      method: 'POST',
      url: this.oauthBaseUrl+"auth/oauth2/token",
      data: qs.stringify(postData),
    };
    try {
      const response: any = await remote_post(axios_config);
      return JSON.parse(response);
    }catch (err) {
      if (err.response.data.error && err.response.data.error == 'invalid_client'){
        return {status_code: 500}
      }
      return {status_code: 200}
    }
  }
}