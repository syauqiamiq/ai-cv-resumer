import { Module } from '@nestjs/common';
import { EvaluationJobService } from './evaluation-job.service';
import { EvaluationJobController } from './evaluation-job.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
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
