import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateEvaluationJobDto } from './dto/request/create-evaluation-job.dto';
import { v4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluationJob } from 'apps/ai-cv-resumer/src/databases/entities/evaluation-job.entity';
import { Repository } from 'typeorm';
import { EEvaluationJobStatus } from 'apps/ai-cv-resumer/src/common/enums/evaluation-job-status.enum';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { S3Service } from '@app/s3';
import { aiCvResumerENVConfig } from 'apps/ai-cv-resumer/src/env.config';
import { streamToBuffer } from 'apps/worker/src/common/functions/stream-to-buffer';
import { Readable } from 'node:stream';
import { PdfService } from '@app/pdf';
import { ChromaService } from '@app/chroma';
import { GeminiService } from '@app/gemini';

@Injectable()
export class EvaluationJobService {
  constructor(
    @InjectQueue('evaluation-queue') private evaluationQueue: Queue,
    @InjectRepository(EvaluationJob)
    private readonly evaluationJobRepository: Repository<EvaluationJob>,
    private readonly s3Service: S3Service,
    private readonly pdfService: PdfService,
    private readonly chromaService: ChromaService,
    private readonly geminiService: GeminiService,
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
    await this.evaluationQueue.add('evaluation-job', jobParam, {
      jobId: savedJob.id,
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: {
        age: 3600,
        count: 1000,
      },
    });

    return savedJob;
  }

  async resultByJobId(jobId: string) {
    const job = await this.evaluationJobRepository.findOne({
      where: {
        id: jobId,
      },
    });
    return job;
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

      // 3. Generate embeddings for CV and Job Description

      const [
        caseStudyEmbeddingResponse,
        jobDescriptionEmbeddingResponse,
        scoringRubricCVEmbeddingResponse,
        scoringRubricProjectEmbeddingResponse,
      ] = await Promise.all([
        await this.geminiService.embedContent({
          model: 'gemini-embedding-001',
          contents: [caseStudyText],
        }),
        await this.geminiService.embedContent({
          model: 'gemini-embedding-001',
          contents: [jobDescriptionText],
        }),

        await this.geminiService.embedContent({
          model: 'gemini-embedding-001',
          contents: [scoringRubricCVText],
        }),

        await this.geminiService.embedContent({
          model: 'gemini-embedding-001',
          contents: [scoringRubricProjectText],
        }),
      ]);

      // 4. Query relevant documents from Chroma based on CV embedding

      const caseStudyEmbedding = caseStudyEmbeddingResponse.embeddings[0];
      const jobDescriptionEmbedding =
        jobDescriptionEmbeddingResponse.embeddings[0];
      const scoringRubricCVEmbedding =
        scoringRubricCVEmbeddingResponse.embeddings[0];
      const scoringRubricProjectEmbedding =
        scoringRubricProjectEmbeddingResponse.embeddings[0];

      if (
        !caseStudyEmbedding ||
        !jobDescriptionEmbedding ||
        !scoringRubricCVEmbedding ||
        !scoringRubricProjectEmbedding
      ) {
        throw new Error('Failed to generate embeddings');
      }

      const ids = [
        'case-study',
        'job-description',
        'scoring-rubric-cv',
        'scoring-rubric-project',
      ];
      const embeddings = [
        caseStudyEmbedding.values,
        jobDescriptionEmbedding.values,
        scoringRubricCVEmbedding.values,
        scoringRubricProjectEmbedding.values,
      ];

      const documents = [
        caseStudyText,
        jobDescriptionText,
        scoringRubricCVText,
        scoringRubricProjectText,
      ];

      const metadatas = [
        { type: 'case-study' },
        { type: 'job-description' },
        { type: 'scoring-rubric-cv' },
        { type: 'scoring-rubric-project' },
      ];

      await this.chromaService.addDocuments({
        ids,
        embeddings,
        metadatas,
        documents,
      });
    } catch (error) {
      console.error('Error triggering RAG:', error);
      throw new BadRequestException('Error triggering RAG: ' + error.message);
    }
  }
}
