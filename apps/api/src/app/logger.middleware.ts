import { Response, NextFunction } from 'express';
import { RequestCustom } from './models/request-details.interface';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { config } from '../../config.helper';
import * as os  from 'os';
import _ = require('lodash');
import { LogObject } from './models/log-object.model';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
logObject: LogObject;
 constructor(private logger: Logger){}

  use(request: RequestCustom, response: Response, next: NextFunction): void {
    const startAt = process.hrtime();
    console.log('request: ', request);
    const { ip, method, originalUrl, errorEmitted, user, userCustomer, client, customer, headers } = request;
    const userAgent = request.get('user-agent') || '';
    this.logObject.isSuccess = !errorEmitted;
    this.logObject.url_path = originalUrl;
    this.logObject.size = +response.get('content-length');
    this.logObject.host = os.hostname();
  
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const diff = process.hrtime(startAt);
      this.logObject.duration = diff[0] * 1e3 + diff[1] * 1e-6;
      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
      

      this.logger.log(this.logObject);
    });

    next();
  }
}

// const logObject: any = {
//   category: 'performance',
//   customerId,
//   clientId,
//   userId,
//   env: config.ENVIRONMENT,
//   namespace: config.ENVIRONMENT,
//   traceId: reqId,
//   host: os.hostname(),
//   service,
//   headers: requestParamsHeaders,
//   point: endpoint,
//   url_path: reqDetails.url_path,
//   shortPoint: shortPoint,
//   gridId: (params && params.gridId) || '',
//   requestService: reqService,
//   requestType: reqDetails.type || '',
//   isSuccess: !error ? 'true' : 'false',
//   resultString: results.join('-'), // FEND-6732: field moved from result -> resultString to avoid Kibana conflict
//   startTimeDate: startTimeDate, // FEND-6732: field moved from startTime -> startTimeDate to avoid Kibana conflict
//   duration: durationMilliSeconds,
//   size: size,
//   categoryVersion: config.PERFORMANCE_LOG.VERSION.toFixed(1),
//   params: JSON.stringify({ params }),
//   error: gelfError,
//   isHybridMode,
//   isMarinUser,
//   isReducedDim,
//   numOfDays: numOfDays || 0,
//   legacyClientId: legacyClientId || '',
//   legacyCustomerId: legacyCustomerId || '',
//   legacyUserId: legacyUserId || '',
// };