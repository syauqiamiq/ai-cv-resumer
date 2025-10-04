/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';

import { HttpExceptionFilter } from '@global/filters/http-exception/http-exception.filter';
import { ApiResponseInterceptor } from '@global/interceptors/api-response/api-response.interceptor';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from 'apps/ai-cv-resumer/src/app.module';
import { aiCvResumerENVConfig } from 'apps/ai-cv-resumer/src/env.config';
import cookieParser from 'cookie-parser';

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

  console.log(
    `RUNNING: ${aiCvResumerENVConfig.app.host}:${aiCvResumerENVConfig.app.runningPort}`,
  );
  await app.listen(
    aiCvResumerENVConfig.app.runningPort,
    aiCvResumerENVConfig.app.host,
  );
}
bootstrap();
