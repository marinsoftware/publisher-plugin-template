import { Injectable } from '@nestjs/common';
import { config } from '@libs/core';
import { hostname } from 'os';
import gelf = require('gelf-pro');
import { isObject, extend } from 'lodash';

/**
 * Gelf Logger
 */
@Injectable()
export class GelfLogger {
  public gelfLogger = gelf;

  constructor() {
    // Initialise the connection
    this.gelfLogger.setConfig({
      fields: {
        service: config.SERVER.name,
        application: config.SERVER.name,
        env: config.SERVER.env,
        host: hostname(),
        hostname: hostname(),
      },
      adapterOptions: {
        host: config.GELF.host,
        port: config.GELF.port,
      },
    });
  }

  /**
   * Debug message to gelf
   */
  public debug<T, V>(debugType: string, message: T, params?: V): void {
    const now = new Date();
    const logMessage = isObject(message) ? message : { message };
    const logObject = extend({
      startTime: now.toISOString(),
      reqService: config.SERVER.name,
      params,
    }, logMessage);

    this.gelfLogger.message(debugType, 7, logObject);
  }
}
