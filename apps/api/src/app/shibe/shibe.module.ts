import { Module } from '@nestjs/common';
import { ShibeService } from './shibe.service';
import { ShibeController } from './shibe.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shibe, ShibeSchema } from './schemas/shibe.schema';
import { HttpModule } from '@nestjs/axios';


@Module({
  controllers: [ShibeController],
  providers: [ShibeService],
  imports: [MongooseModule.forFeature([{ name: Shibe.name, schema: ShibeSchema }]), HttpModule],
})
export class ShibeModule {}
