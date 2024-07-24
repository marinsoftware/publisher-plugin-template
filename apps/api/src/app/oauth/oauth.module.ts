import {  Module, Logger } from '@nestjs/common';
import { PublishersService } from './oauth.service';
import { PublishersController } from './oauth.controller';
import {PublisherUtil} from './utils/publisher_utils';


@Module({
  controllers: [PublishersController],
  providers: [Logger, PublishersService, PublisherUtil],
  exports: [PublisherUtil]
})
export class OAuthModule {}