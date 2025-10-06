/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { aiCvResumerENVConfig } from './env.config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpExceptionFilter } from '@global/filters/http-exception/http-exception.filter';
import { ApiResponseInterceptor } from '@global/interceptors/api-response/api-response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const allowedFrontendUrl = aiCvResumerENVConfig.app.allowedFrontendUrl;
  let splittedAllowFrontendUrl: string[] = ['localhost'];

  if (allowedFrontendUrl) {
    splittedAllowFrontendUrl = allowedFrontendUrl.split(',');
  }

  app.enableCors({
    credentials: true,
    origin: splittedAllowFrontendUrl,
  });
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ApiResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  // Setup Swagger document
  const config = new DocumentBuilder()
    .setTitle('AI CV Resume API')
    .setDescription(
      'The AI CV Resume API powered by Gemini and Chroma with RAG Method and created by Syauqi Amiq',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Setup Scalar API Reference instead of Swagger UI
  app.use(
    '/api-documentation',
    apiReference({
      content: document,
    }),
  );

  console.log(
    `RUNNING: ${aiCvResumerENVConfig.app.host}:${aiCvResumerENVConfig.app.runningPort}`,
  );
  await app.listen(
    aiCvResumerENVConfig.app.runningPort,
    aiCvResumerENVConfig.app.host,
  );
}
bootstrap();
