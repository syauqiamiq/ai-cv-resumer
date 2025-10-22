import { Logger } from '@nestjs/common';

import { ChromaService } from '@app/chroma';
import { GeminiService } from '@app/gemini';
import { PdfService } from '@app/pdf';
import { S3Service } from '@app/s3';
import { cleanAIJsonResponse } from '@global/functions/json-ai-cleaner';
import { retry } from '@global/functions/retry';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { EEvaluationJobStatus } from 'apps/worker/src/common/enums/evaluation-job-status.enum';
import { streamToBuffer } from 'apps/worker/src/common/functions/stream-to-buffer';
import { evaluateCvPrompt } from 'apps/worker/src/common/prompts/evaluate-cv.prompt';
import { overallSummaryPrompt } from 'apps/worker/src/common/prompts/overall-summary.prompt';
import { EvaluationJob } from 'apps/worker/src/databases/entities/evaluation-job.entity';
import { workerENVConfig } from 'apps/worker/src/env.config';
import { Job } from 'bullmq';
import { Readable } from 'stream';
import { DataSource, Repository } from 'typeorm';
import { EvaluationJobPayloadDto } from './dto/request/evaluation-job-payload.dto';

@Processor('evaluation-queue-v2')
export class EvaluationJobConsumer extends WorkerHost {
  private readonly logger = new Logger(EvaluationJobConsumer.name);

  constructor(
    private readonly s3Service: S3Service,
    private readonly pdfService: PdfService,
    private readonly chromaService: ChromaService,
    private readonly geminiService: GeminiService,
    private readonly dataSource: DataSource,
    @InjectRepository(EvaluationJob)
    private readonly evaluationJobRepository: Repository<EvaluationJob>,
  ) {
    super();
  }

  async process(job: Job<EvaluationJobPayloadDto>) {
    this.logger.log(`Received evaluation job: ${job.id}`);
    const payload = job.data;

    const evaluationJobData = await this.evaluationJobRepository.findOne({
      where: { id: payload.id },
      relationLoadStrategy: 'join',
      relations: {
        cvAttachment: true,
      },
    });

    if (!evaluationJobData) {
      throw new Error(`Evaluation job with ID ${payload.id} not found`);
    }

    if (evaluationJobData.status !== EEvaluationJobStatus.QUEUED) {
      throw new Error(
        `Evaluation job with ID ${payload.id} is not in QUEUED status`,
      );
    }

    await this.evaluationJobRepository.update(evaluationJobData.id, {
      status: EEvaluationJobStatus.PROCESSING,
      evaluatedAt: new Date().toISOString(),
    });
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Download CV and Job Description from S3

      const cvFile = await this.s3Service.getFile(
        workerENVConfig.aws.s3.bucketName,
        evaluationJobData.cvAttachment.path,
      );

      const cvBuffer = await streamToBuffer(cvFile.Body as Readable);

      // 2. Extract text from PDF files
      const cvText = await this.pdfService.extractText(cvBuffer);

      // 5. Use Gemini to evaluate CV against Job Description and generate feedback
      let parsedCvResult: any = null;
      if (!evaluationJobData.cvResult) {
        const cvEvaluationPrompt = evaluateCvPrompt(
          cvText,
          payload.jobTitle,
          `This section assesses a candidate's suitability for the role based on four key parameters. First, Technical Skills (40%) assesses the candidate's technical abilities. A score of 1 indicates no relevance, while 5 indicates a perfect match with the technical criteria outlined in the job description. Second, Experience Level (25%) measures the length of experience and the complexity of projects handled—ranging from simple projects lasting less than a year (score 1) to more than five years of experience with high-impact projects (score 5). Next, Relevant Achievements (20%) focuses on the tangible impact of previous work, such as performance improvement or system adoption. The highest score is awarded for significant contributions with measurable results. Finally, Cultural/Collaboration Fit (15%) assesses communication skills, enthusiasm for learning, and teamwork and leadership. A score of 1 indicates these aspects are not present at all, while 5 indicates very strong interpersonal skills consistently demonstrated in work experience.`,
        );

        const response = await retry(
          () =>
            this.geminiService.generateContent({
              model: 'gemini-2.5-flash',
              contents: cvEvaluationPrompt,
              config: {
                temperature: 0.1,
              },
            }),
          3,
          1000,
        );
        parsedCvResult = cleanAIJsonResponse(response.text);

        await this.evaluationJobRepository.update(evaluationJobData.id, {
          cvResult: parsedCvResult,
        });
      }

      const overallPrompt = overallSummaryPrompt(
        parsedCvResult
          ? JSON.stringify(parsedCvResult)
          : JSON.stringify(evaluationJobData.cvResult),
        payload.jobTitle,
        payload.jobDescription,
      );

      const overallSummaryResponse = await retry(
        () =>
          this.geminiService.generateContent({
            model: 'gemini-2.5-flash',
            contents: overallPrompt,
            config: {
              temperature: 0.1,
            },
          }),
        3,
        1000,
      );

      const parsedOverallSummaryResult = cleanAIJsonResponse(
        overallSummaryResponse.text,
      );

      const finalResult: any = {
        job_fitment_score:
          parsedOverallSummaryResult.job_fitment_score ||
          evaluationJobData.finalResult?.job_fitment_score,
        overall_summary:
          parsedOverallSummaryResult.overall_summary ||
          evaluationJobData.finalResult?.overall_summary,
        cv_evaluation: parsedCvResult
          ? parsedCvResult
          : evaluationJobData.cvResult,
      };

      await this.evaluationJobRepository.update(evaluationJobData.id, {
        finalResult: finalResult,
      });
      await this.evaluationJobRepository.update(evaluationJobData.id, {
        status: EEvaluationJobStatus.COMPLETED,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(`Error processing job ${payload.id}:`, error);
      await queryRunner.rollbackTransaction();
      await this.evaluationJobRepository.update(evaluationJobData.id, {
        status: EEvaluationJobStatus.FAILED,
        errorMessage: (error as Error).message,
      });
    } finally {
      await queryRunner.release();
    }
  }
}
