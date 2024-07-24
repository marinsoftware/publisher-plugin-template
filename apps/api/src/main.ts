import { contextService } from '@libs/core';
import { MarinLogger } from '@libs/logger';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import {RequestMethod} from "@nestjs/common";

const globalPrefix = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });

  const marinLogger = app.get<MarinLogger>(MarinLogger);
  marinLogger.setContext(contextService.getApplicationName());
  app.useLogger(marinLogger);

  const config = new DocumentBuilder().setTitle('marin-publisher-api').setDescription('Publisher Decodermind API').setVersion('1.0').build();
  app.setGlobalPrefix(globalPrefix, {
    exclude: [
      {
        path: 'admin/status', method: RequestMethod.GET,
      },
      {
        path: 'admin/status/marin-publisherName-api-service', method: RequestMethod.GET,
      },
      {
        path: 'aadmin/status/marin-publisherName-api-service/L1', method: RequestMethod.GET,
      },
      {
        path: 'admin/status/marin-publisherName-api-service/L2', method: RequestMethod.GET
      },
      {
        path: 'admin/status/marin-publisherName-api-service/L3', method: RequestMethod.GET
      }
    ],
  });
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.getHttpAdapter().getInstance().set('json spaces', 2);
  const port = process.env.PORT || 3333;
  await app.listen(port);
  marinLogger.log(`Service started on ${port}`);
}

bootstrap();
