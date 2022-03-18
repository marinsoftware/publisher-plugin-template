/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { WinstonModule } from 'nest-winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
const esTransportOpts = {
  level: 'info',
  clientOpts: {
    node: 'http://elasticsearch:9200',
  },
};
const esTransport = new ElasticsearchTransport(esTransportOpts);
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
    logger: WinstonModule.createLogger({
      transports: [esTransport],
    }),
  });
  const globalPrefix = 'api';
  const config = new DocumentBuilder()
    .setTitle('Cats')
    .setDescription('Cats API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  await app.listen(port);
}

bootstrap();
