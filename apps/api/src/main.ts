/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

 import { NestFactory } from '@nestjs/core';
 import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
 import { Logger } from 'nestjs-pino';
 import { AppModule } from './app/app.module';
 
 async function bootstrap() {
   const app = await NestFactory.create(AppModule, { cors: true, bufferLogs: true });
   const globalPrefix = 'api';
   const config = new DocumentBuilder()
     .setTitle('Cats')
     .setDescription('Cats API')
     .setVersion('1.0')
     .build();
   const document = SwaggerModule.createDocument(app, config);
   SwaggerModule.setup('api', app, document);
   app.setGlobalPrefix(globalPrefix);
   app.useLogger(app.get(Logger));
   const port = process.env.PORT || 3333;
   await app.listen(port);
 }
 
 bootstrap();
 