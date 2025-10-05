import { ChromaModule } from '@app/chroma';
import { GeminiModule } from '@app/gemini';
import { PdfModule } from '@app/pdf';
import { S3Module } from '@app/s3/s3.module';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationJobModule } from './consumer/v1/evaluation-job/evaluation-job.module';
import { databaseConfig } from './databases/database-config';
import { workerENVConfig } from './env.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    BullModule.forRoot({
      connection: {
        host: workerENVConfig.redis.host,
        port: workerENVConfig.redis.port,
        password: workerENVConfig.redis.pass,
      },
    }),
    S3Module,
    GeminiModule,
    PdfModule,
    ChromaModule,
    EvaluationJobModule,
  ],
  providers: [],
})
export class WorkerModule {}
