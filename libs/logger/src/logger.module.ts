import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { MarinLogger } from './services/marin-logger.service';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    CoreModule,
    PinoLoggerModule.forRoot(),
  ],
  controllers: [],
  providers: [
    MarinLogger,
  ],
  exports: [
    MarinLogger,
  ],
})
export class LoggerModule {}
