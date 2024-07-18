import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
// import { remote_post, remote_get } from './remote_call';
import { environment } from '../../environments/environment';
import config from '../../../config.helper';

const qs = require('qs');


@Injectable()
export class PublisherUtil {
  appId: string;
  secret: string;
  baseUrl: string;
  constructor() {
    this.appId = config.APP_ID;
    this.secret = config.SECRET_ADS;
    this.baseUrl = environment.AUTH_BASE_URL;
  }

  async refreshAccessToken(refresh_token: string){
    const postData = {
      'grant_type': "refresh_token",
      'refresh_token': refresh_token,
      'client_id': this.appId,
      'client_secret': this.secret,

    };
    const axios_config = {
      method: 'post',
      url: this.baseUrl,
      data: qs.stringify(postData),
    };
    const response: any = await remote_post(axios_config);
    return JSON.parse(response);
  }
}

function valueToString (value: any) {
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    return value;
}  

async function remote_post(axios_config: any) {
    return new Promise((resolve, reject) => {
      axios(axios_config)
        .then(res => {
          resolve(valueToString(res.data));
        })
        .catch(error => {
          reject(error)
        });
    })
}