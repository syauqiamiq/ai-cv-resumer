import { NestFactory } from '@nestjs/core';
import { ProjectWorkerModule } from './project-worker.module';

async function bootstrap() {
  const app = await NestFactory.create(ProjectWorkerModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
