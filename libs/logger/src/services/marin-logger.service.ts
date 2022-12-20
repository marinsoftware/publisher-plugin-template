import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class MarinLogger extends PinoLogger {
  /**
   * Log the message, if there is an error object it will log as an error instead
   */
  public log(message: string, params: any = {}, traceId?: string ): void {
    const logObject = Object.assign({ extra: params }, { message, reqId: traceId });
    if (params.error || params.err) {
      this.error(logObject);
    } else {
      this.info(logObject);
    }
  }
}
