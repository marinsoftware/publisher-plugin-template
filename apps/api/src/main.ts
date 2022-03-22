/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { utilities, WinstonModule } from 'nest-winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import winston = require('winston');
const esTransportOpts = {
  level: 'info',
  clientOpts: {
    node: 'http://elasticsearch:9200',
  },
};
const esTransport = new ElasticsearchTransport(esTransportOpts);

const consoleLogging = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    utilities.format.nestLike('MyApp', { prettyPrint: true }),
  ),
});
const errorFile = new winston.transports.File({level: 'error', filename: 'error.json'});
const combinedFile = new winston.transports.File({level: 'info', filename: 'combined.json'});
function transports(environment: string): winston.transport[] {
  if(environment === 'prouction') {
    return [esTransport, errorFile, combinedFile];
  } 
  return [consoleLogging, combinedFile, errorFile]
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
    logger: WinstonModule.createLogger({
      transports: transports(process.env.NODE_ENV),
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
