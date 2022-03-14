import {  Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';

@Module({
  imports: [],
  controllers: [CatsController],
  providers: [CatsService]
})
export class CatsModule {}
