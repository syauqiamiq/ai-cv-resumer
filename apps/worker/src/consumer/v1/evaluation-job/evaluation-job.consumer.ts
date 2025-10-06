import { Inject, Logger } from '@nestjs/common';

import { ChromaService } from '@app/chroma';
import { GeminiService } from '@app/gemini';
import { PdfService } from '@app/pdf';
import { S3Service } from '@app/s3';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DataSource, Repository } from 'typeorm';
import { EvaluationJobPayloadDto } from './dto/request/evaluation-job-payload.dto';
import { EvaluationJob } from 'apps/worker/src/databases/entities/evaluation-job.entity';
import { workerENVConfig } from 'apps/worker/src/env.config';
import { streamToBuffer } from 'apps/worker/src/common/functions/stream-to-buffer';
import { Readable } from 'stream';
import { evaluateCvPrompt } from 'apps/worker/src/common/prompts/evaluate-cv.prompt';
import { evaluateProjectReportPrompt } from 'apps/worker/src/common/prompts/evaluate-project-report.prompt';
import { overallSummaryPrompt } from 'apps/worker/src/common/prompts/overall-summary.prompt';
import { EEvaluationJobStatus } from 'apps/worker/src/common/enums/evaluation-job-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { cleanAIJsonResponse } from '@global/functions/json-ai-cleaner';
import { retry } from '@global/functions/retry';

@Processor('evaluation-queue')
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
        projectAttachment: true,
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
      const projectReportFile = await this.s3Service.getFile(
        workerENVConfig.aws.s3.bucketName,
        evaluationJobData.projectAttachment.path,
      );

      const cvBuffer = await streamToBuffer(cvFile.Body as Readable);
      const projectReportBuffer = await streamToBuffer(
        projectReportFile.Body as Readable,
      );

      // 2. Extract text from PDF files
      const cvText = await this.pdfService.extractText(cvBuffer);
      const projectReportText =
        await this.pdfService.extractText(projectReportBuffer);

      // 3. Generate embeddings for CV and Job Description
      let contextResult: string[] = [];
      if (
        !evaluationJobData.cvResult &&
        !evaluationJobData.projectResult &&
        !evaluationJobData.finalResult
      ) {
        const embeddedContent = await this.geminiService.embedContent({
          model: 'gemini-embedding-001',
          contents: [
            `Evaluation criteria include job description and cv scoring rubric, project evaluation scoring rubric for ${payload.jobTitle} CV Candidate and Project Report Submission.`,
          ],
        });

        // 4. Query relevant documents from Chroma based on CV embedding

        if (!embeddedContent.embeddings[0]) {
          throw new Error('Failed to generate embeddings');
        }

        contextResult = await this.chromaService.query(
          embeddedContent.embeddings[0].values,
          5,
        );
      }

      // 5. Use Gemini to evaluate CV against Job Description and generate feedback
      let parsedCvResult: any = null;
      if (!evaluationJobData.cvResult) {
        const cvEvaluationPrompt = evaluateCvPrompt(
          cvText,
          payload.jobTitle,
          contextResult.join('\n'),
        );

        const response = await retry(
          () =>
            this.geminiService.generateContent({
              model: 'gemini-2.5-flash',
              contents: cvEvaluationPrompt,
              config: {
                temperature: 0.1,
                maxOutputTokens: 5000,
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

      // 6. Use Gemini to evaluate Project Report against Case Study Brief and generate feedback

      let parsedProjectReportResult: any = null;
      if (!evaluationJobData.projectResult) {
        const projectReportEvaluationPrompt = evaluateProjectReportPrompt(
          projectReportText,
          payload.jobTitle,
          contextResult.join('\n'),
        );

        const projectReportResponse = await retry(
          () =>
            this.geminiService.generateContent({
              model: 'gemini-2.5-flash',
              contents: projectReportEvaluationPrompt,
              config: {
                temperature: 0.1,
                maxOutputTokens: 5000,
              },
            }),
          3,
          1000,
        );

        await this.evaluationJobRepository.update(evaluationJobData.id, {
          status: EEvaluationJobStatus.PROCESSING,
        });

        parsedProjectReportResult = cleanAIJsonResponse(
          projectReportResponse.text,
        );

        await this.evaluationJobRepository.update(evaluationJobData.id, {
          projectResult: parsedProjectReportResult,
        });
      }

      // 7. Use Gemini to evaluate Overall Summary against Job Description and generate feedback

      const overallPrompt = overallSummaryPrompt(
        parsedCvResult
          ? JSON.stringify(parsedCvResult)
          : JSON.stringify(evaluationJobData.cvResult),
        parsedProjectReportResult
          ? JSON.stringify(parsedProjectReportResult)
          : JSON.stringify(evaluationJobData.projectResult),
        payload.jobTitle,
        contextResult.join('\n'),
      );

      const overallSummaryResponse = await retry(
        () =>
          this.geminiService.generateContent({
            model: 'gemini-2.5-flash',
            contents: overallPrompt,
            config: {
              temperature: 0.1,
              maxOutputTokens: 5000,
            },
          }),
        3,
        1000,
      );

      const parsedOverallSummaryResult = cleanAIJsonResponse(
        overallSummaryResponse.text,
      );

      const finalResult: any = {
        cv_match_rate: parsedCvResult
          ? parseFloat(parsedCvResult.cv_score) * 0.2
          : parseFloat(evaluationJobData.cvResult?.cv_score) * 0.2,
        cv_feedback: parsedCvResult
          ? parsedCvResult.feedback
          : evaluationJobData.cvResult?.feedback,
        project_score: parsedProjectReportResult
          ? parsedProjectReportResult.project_report_score
          : evaluationJobData.projectResult?.project_report_score,
        project_feedback: parsedProjectReportResult
          ? parsedProjectReportResult.feedback
          : evaluationJobData.projectResult?.feedback,
        overall_summary:
          parsedOverallSummaryResult.overall_summary ||
          evaluationJobData.finalResult?.overall_summary,
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
