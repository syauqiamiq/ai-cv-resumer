import { ChromaService } from '@app/chroma';
import { GeminiService } from '@app/gemini';
import { PdfService } from '@app/pdf';
import { S3Service } from '@app/s3';
import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EEvaluationJobStatus } from 'apps/ai-cv-resumer/src/common/enums/evaluation-job-status.enum';
import { EUserAttachmentType } from 'apps/ai-cv-resumer/src/common/enums/user-attachment-type.enum';
import { EvaluationJob } from 'apps/ai-cv-resumer/src/databases/entities/evaluation-job.entity';
import { UserAttachment } from 'apps/ai-cv-resumer/src/databases/entities/user-attachment.entity';
import { aiCvResumerENVConfig } from 'apps/ai-cv-resumer/src/env.config';
import { streamToBuffer } from 'apps/worker/src/common/functions/stream-to-buffer';
import { Queue } from 'bullmq';
import { Readable } from 'node:stream';
import { Repository } from 'typeorm';
import { CreateEvaluationJobDto } from './dto/request/create-evaluation-job.dto';

@Injectable()
export class EvaluationJobService {
  constructor(
    @InjectQueue('evaluation-queue-v2') private evaluationQueue: Queue,
    @InjectRepository(EvaluationJob)
    private readonly evaluationJobRepository: Repository<EvaluationJob>,
    @InjectRepository(UserAttachment)
    private readonly userAttachmentRepository: Repository<UserAttachment>,
    private readonly s3Service: S3Service,
    private readonly pdfService: PdfService,
    private readonly chromaService: ChromaService,
    private readonly geminiService: GeminiService,
  ) {}

  async executeEvaluationJob(
    createEvaluationJobDto: CreateEvaluationJobDto,
    userId: string,
  ) {
    const cvAttachment = await this.userAttachmentRepository.findOne({
      where: {
        id: createEvaluationJobDto.cvAttachmentId,
        userId: userId,
        type: EUserAttachmentType.CV,
      },
    });

    if (!cvAttachment) {
      throw new BadRequestException('CV Attachment not found');
    }

    // Save evaluation job to database (not implemented in this snippet)
    const savedJob = await this.evaluationJobRepository.save({
      cvAttachmentId: createEvaluationJobDto.cvAttachmentId,
      jobTitle: createEvaluationJobDto.jobTitle,
      jobDescription: createEvaluationJobDto.jobDescription,
      status: EEvaluationJobStatus.QUEUED,
      userId: userId,
    });

    const jobParam = {
      id: savedJob.id,
      cvAttachmentId: savedJob.cvAttachmentId,
      jobTitle: savedJob.jobTitle,
      jobDescription: savedJob.jobDescription,
      createdAt: savedJob.createdAt,
    };

    await this.evaluationQueue.add('evaluation-job-v2', jobParam, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: {
        age: 3600,
        count: 1000,
      },
    });

    return {
      jobId: savedJob.id,
      status: savedJob.status,
      result: null,
    };
  }

  async retryEvaluationJobById(jobId: string, userId: string) {
    // Save evaluation job to database (not implemented in this snippet)
    const foundJob = await this.evaluationJobRepository.findOne({
      where: {
        id: jobId,
        userId: userId,
      },
    });

    if (!foundJob) {
      throw new BadRequestException('Job not found');
    }

    if (
      foundJob.status === EEvaluationJobStatus.QUEUED ||
      foundJob.status === EEvaluationJobStatus.PROCESSING
    ) {
      throw new BadRequestException(
        'Job is cannot be retried while in progress',
      );
    }

    if (foundJob.retryCount >= 3) {
      throw new BadRequestException('Job has reached maximum retry attempts');
    }
    await this.evaluationJobRepository.update(
      {
        id: jobId,
        userId: userId,
      },
      {
        status: EEvaluationJobStatus.QUEUED,
        retryCount: foundJob.retryCount + 1,
      },
    );
    const jobParam = {
      id: foundJob.id,
      cvAttachmentId: foundJob.cvAttachmentId,
      jobTitle: foundJob.jobTitle,
      jobDescription: foundJob.jobDescription,
      createdAt: foundJob.createdAt,
    };

    await this.evaluationQueue.add('evaluation-job-v2', jobParam, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: {
        age: 3600,
        count: 1000,
      },
    });

    return {
      jobId: foundJob.id,
      status: foundJob.status,
      result: null,
    };
  }

  async resultByJobId(jobId: string, userId: string) {
    const job = await this.evaluationJobRepository.findOne({
      where: {
        id: jobId,
        userId: userId,
      },
    });

    if (!job) {
      throw new BadRequestException('Job not found');
    }
    return {
      jobId: job.id,
      status: job.status,
      result: job.finalResult,
    };
  }

  async triggerRAG() {
    try {
      // Logic to trigger RAG (Retrieval-Augmented Generation)

      const caseStudyBrief = await this.s3Service.getFile(
        aiCvResumerENVConfig.aws.s3.bucketName,
        'ingest/case_brief.pdf',
      );
      const jobDescription = await this.s3Service.getFile(
        aiCvResumerENVConfig.aws.s3.bucketName,
        'ingest/job_description.pdf',
      );
      const scoringRubricCV = await this.s3Service.getFile(
        aiCvResumerENVConfig.aws.s3.bucketName,
        'ingest/scoring_rubric_cv.pdf',
      );
      const scoringRubricProject = await this.s3Service.getFile(
        aiCvResumerENVConfig.aws.s3.bucketName,
        'ingest/scoring_rubrik_project_report.pdf',
      );

      const caseStudyBuffer = await streamToBuffer(
        caseStudyBrief.Body as Readable,
      );
      const jobDescriptionBuffer = await streamToBuffer(
        jobDescription.Body as Readable,
      );
      const scoringRubricCVBuffer = await streamToBuffer(
        scoringRubricCV.Body as Readable,
      );
      const scoringRubricProjectBuffer = await streamToBuffer(
        scoringRubricProject.Body as Readable,
      );

      // 2. Extract text from PDF files
      const caseStudyText = await this.pdfService.extractText(caseStudyBuffer);
      const jobDescriptionText =
        await this.pdfService.extractText(jobDescriptionBuffer);
      const scoringRubricCVText = await this.pdfService.extractText(
        scoringRubricCVBuffer,
      );
      const scoringRubricProjectText = await this.pdfService.extractText(
        scoringRubricProjectBuffer,
      );

      const combinedCvContextText = `${jobDescriptionText}\n\nRubric:\n${scoringRubricCVText}`;
      const combinedProjectContextText = `${caseStudyText}\n\nRubric:\n${scoringRubricProjectText}`;

      // 3. Generate embeddings for CV and Job Description

      const [cvContextEmbeddingResponse, projectContextEmbeddingResponse] =
        await Promise.all([
          await this.geminiService.embedContent({
            model: 'gemini-embedding-001',
            contents: [combinedCvContextText],
          }),
          await this.geminiService.embedContent({
            model: 'gemini-embedding-001',
            contents: [combinedProjectContextText],
          }),
        ]);

      // 4. Query relevant documents from Chroma based on CV embedding

      const cvContextVector = cvContextEmbeddingResponse.embeddings[0];
      const projectContextVector =
        projectContextEmbeddingResponse.embeddings[0];

      if (!cvContextVector || !projectContextVector) {
        throw new Error('Failed to generate embeddings');
      }

      await this.chromaService.upsert({
        collection: 'cv-vector',
        ids: ['cv-context'],
        embeddings: [cvContextVector.values],
        metadatas: [
          {
            type: 'cv-context',
            source: 'initial-ingest',
          },
        ],
        documents: [combinedCvContextText],
      });

      await this.chromaService.upsert({
        collection: 'project-vector',
        ids: ['project-context'],
        embeddings: [projectContextVector.values],
        metadatas: [
          {
            type: 'project-context',
            source: 'initial-ingest',
          },
        ],
        documents: [combinedProjectContextText],
      });
    } catch (error) {
      console.error('Error triggering RAG:', error);
      throw new BadRequestException('Error triggering RAG: ' + error.message);
    }
  }
}
