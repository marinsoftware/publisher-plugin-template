import { Injectable } from '@nestjs/common';
import { GelfLogger } from './gelf-logger.service';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class MarinLogger extends PinoLogger {
  constructor(protected gelfLogger: GelfLogger) {
    super({});
  }
  /**
   * Log the message, if there is an error object it will log as an error instead
   */
  public log(message: string, params: any, traceId?: string ): LoggerReturnType {
    const logObject = Object.assign({ extra: params }, { message, reqId: traceId });
    if (params.error || params.err) {
      this.error(logObject);
    } else {
      this.info(logObject);
    }

    return {
      /**
       * Logs the message to gelf
       */
      withGelf: (gelfLogType: string): void => {
        this.gelfLogger.debug(gelfLogType, message, { extra: params });
      }
    }
  }
}

interface LoggerReturnType {
  withGelf: (gelfLogType: string) => void;
}
