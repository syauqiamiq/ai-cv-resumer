import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateEvaluationJobDto } from './dto/request/create-evaluation-job.dto';
import { v4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluationJob } from 'apps/ai-cv-resumer/src/databases/entities/evaluation-job.entity';
import { Repository } from 'typeorm';
import { EEvaluationJobStatus } from 'apps/ai-cv-resumer/src/common/enums/evaluation-job-status.enum';

@Injectable()
export class EvaluationJobService {
  constructor(
    @Inject('EVALUATION_JOB_PRODUCER')
    private readonly kafkaClient: ClientKafka,
    @InjectRepository(EvaluationJob)
    private readonly evaluationJobRepository: Repository<EvaluationJob>,
  ) {}

  async executeEvaluationJob(createEvaluationJobDto: CreateEvaluationJobDto) {
    // Save evaluation job to database (not implemented in this snippet)
    const savedJob = await this.evaluationJobRepository.save({
      cvAttachmentId: createEvaluationJobDto.cvAttachmentId,
      projectAttachmentId: createEvaluationJobDto.projectAttachmentId,
      jobTitle: createEvaluationJobDto.jobTitle,
      status: EEvaluationJobStatus.PENDING,
    });

    const jobParam = {
      id: savedJob.id,
      cvAttachmentId: savedJob.cvAttachmentId,
      projectAttachmentId: savedJob.projectAttachmentId,
      jobTitle: savedJob.jobTitle,
      createdAt: savedJob.createdAt,
    };

    // Emit event to Kafka topic
    await this.kafkaClient.emit('evaluation-jobs', jobParam);

    return savedJob;
  }

  async resultByJobId(jobId: string) {
    const job = await this.evaluationJobRepository.findOne({
      where: { id: jobId },
    });
    return job;
  }
}
