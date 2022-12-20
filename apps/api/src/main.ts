import { contextService } from '@libs/core';
import { MarinLogger } from '@libs/logger';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });

  const marinLogger = app.get<MarinLogger>(MarinLogger);
  marinLogger.setContext(contextService.getApplicationName());
  app.useLogger(marinLogger);

  const config = new DocumentBuilder().setTitle('Cats').setDescription('Cats API').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const port = process.env.PORT || 3333;
  await app.listen(port);
  marinLogger.log(`Service started on ${port}`);
}

bootstrap();
