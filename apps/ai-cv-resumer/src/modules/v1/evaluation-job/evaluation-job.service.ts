import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateEvaluationJobDto } from './dto/request/create-evaluation-job.dto';

@Injectable()
export class EvaluationJobService {
  constructor(
    @Inject('EVALUATION_JOB_PRODUCER')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async executeEvaluationJob(createEvaluationJobDto: CreateEvaluationJobDto) {
    return 'This action adds a new evaluationJob';
  }
}
