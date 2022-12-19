import { Module } from '@nestjs/common';
import { VersionService } from './version.service';

@Module({
  controllers: [],
  providers: [
    VersionService,
  ],
  exports: [
    VersionService,
  ],
})
export class CoreModule {}
