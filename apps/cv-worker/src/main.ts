import { NestFactory } from '@nestjs/core';
import { CvWorkerModule } from './cv-worker.module';

async function bootstrap() {
  const app = await NestFactory.create(CvWorkerModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
