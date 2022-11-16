import { Module } from '@nestjs/common';
import { CoreModule } from '@libs/core';
import { GelfLogger } from './services/gelf-logger.service';
import { Logger } from '@nestjs/common';

@Module({
  imports: [
    CoreModule,
  ],
  controllers: [],
  providers: [
    GelfLogger,
    Logger,
  ],
  exports: [],
})
export class LoggerModule {}
