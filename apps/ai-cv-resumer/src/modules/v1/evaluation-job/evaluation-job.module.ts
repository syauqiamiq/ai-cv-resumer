import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationJob } from 'apps/ai-cv-resumer/src/databases/entities/evaluation-job.entity';
import { EvaluationJobController } from './evaluation-job.controller';
import { EvaluationJobService } from './evaluation-job.service';
import { BullModule } from '@nestjs/bullmq';
import { aiCvResumerENVConfig } from 'apps/ai-cv-resumer/src/env.config';
import { UserAttachment } from 'apps/ai-cv-resumer/src/databases/entities/user-attachment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EvaluationJob, UserAttachment]),
    BullModule.registerQueue({
      name: 'evaluation-queue',
      connection: {
        host: aiCvResumerENVConfig.redis.host,
        password: aiCvResumerENVConfig.redis.pass,
        port: aiCvResumerENVConfig.redis.port,
      },
    }),
  ],
  controllers: [EvaluationJobController],
  providers: [EvaluationJobService],
})
export class EvaluationJobModule {}
