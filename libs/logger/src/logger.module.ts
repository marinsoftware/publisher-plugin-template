import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { GelfLogger } from './services/gelf-logger.service';
import { MarinLogger } from './services/marin-logger.service';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    CoreModule,
    PinoLoggerModule.forRoot(),
  ],
  controllers: [],
  providers: [
    GelfLogger,
    MarinLogger,
  ],
  exports: [
    GelfLogger,
    MarinLogger,
  ],
})
export class LoggerModule {}
