import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationJob } from 'apps/ai-cv-resumer/src/databases/entities/evaluation-job.entity';
import { EvaluationJobController } from './evaluation-job.controller';
import { EvaluationJobService } from './evaluation-job.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EvaluationJob]),
    ClientsModule.register([
      {
        name: 'EVALUATION_JOB_PRODUCER',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'evaluation-job-producer',
            brokers: ['86.48.0.71:9092'],
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
  controllers: [EvaluationJobController],
  providers: [EvaluationJobService],
})
export class EvaluationJobModule {}
