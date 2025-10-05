/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { workerENVConfig } from './env.config';
import { WorkerModule } from './worker.module';

async function bootstrap() {
  const app = await NestFactory.create(WorkerModule);

  await app.listen(workerENVConfig.app.runningPort, workerENVConfig.app.host);
  console.log('Worker service is listening...');
}
bootstrap();
