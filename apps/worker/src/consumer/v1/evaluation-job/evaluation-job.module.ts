import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { workerENVConfig } from 'apps/worker/src/env.config';
import { EvaluationJobConsumer } from './evaluation-job.consumer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationJob } from 'apps/worker/src/databases/entities/evaluation-job.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EvaluationJob]),
    BullModule.registerQueue({
      name: 'evaluation-queue',
      connection: {
        host: workerENVConfig.redis.host,
        password: workerENVConfig.redis.pass,
        port: workerENVConfig.redis.port,
      },
    }),
  ],
  providers: [EvaluationJobConsumer],
})
export class EvaluationJobModule {}
