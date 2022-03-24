import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { utilities, WinstonModule } from 'nest-winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import winston = require('winston');
import config from '../config.helper';

const globalPrefix = 'api';
const esTransportOpts = {
  level: 'info',
  clientOpts: {
    node: `https://${config.GELF.host}:${config.GELF.port}`,
    // node: 'http://localhost:9200',
  },
};
const esTransport = new ElasticsearchTransport(esTransportOpts);

const consoleLogging = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    utilities.format.nestLike('NodeSwagger', { prettyPrint: true }),
  ),
});
const errorFile = new winston.transports.File({level: 'error', filename: `logs/${globalPrefix}/error.json`});
const combinedFile = new winston.transports.File({level: 'info', filename: `logs/${globalPrefix}combined.json`});
function transports(environment: string): winston.transport[] {
  if(environment === 'production') {
    return [esTransport, errorFile, combinedFile];
  } 
  return [consoleLogging, combinedFile, errorFile, esTransport]
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
    logger: WinstonModule.createLogger({
      transports: transports(process.env.NODE_ENV),
    }),
  });

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
