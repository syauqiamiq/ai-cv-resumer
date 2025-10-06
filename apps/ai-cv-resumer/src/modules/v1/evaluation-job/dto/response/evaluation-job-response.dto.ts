import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IEvaluationJob } from 'apps/ai-cv-resumer/src/databases/interfaces/evaluation-job.interface';
import { EEvaluationJobStatus } from 'apps/worker/src/common/enums/evaluation-job-status.enum';

export class EvaluationJobResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the evaluation job',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  jobId: string;

  @ApiProperty({
    description: 'Current status of the evaluation job',
    example: 'QUEUE',
    enum: EEvaluationJobStatus,
  })
  status: string;

  @ApiPropertyOptional({
    description:
      'Evaluation result containing CV analysis, project analysis, and overall summary',
    nullable: true,
    example: {
      cvMatchRate: 0.72,
      cvFeedback: 'The CV is ....',
      projectScore: 5,
      projectFeedback: 'The Project Report is ....',
      overallSummary: 'The candidate presents ....',
    },
  })
  result?: any | null;

  @ApiPropertyOptional({
    description: 'Timestamp when the job was created',
    example: '2025-10-06T12:00:00Z',
  })
  createdAt?: string;

  @ApiPropertyOptional({
    description: 'Timestamp when the evaluation was completed',
    example: '2025-10-06T12:05:30Z',
  })
  evaluatedAt?: string;

  static toResponse(data: {
    jobId: string;
    status: string;
    result?: any | null;
    createdAt?: string;
    evaluatedAt?: string;
  }): EvaluationJobResponseDto {
    return {
      jobId: data.jobId,
      status: data.status,
      result: data.result,
      createdAt: data.createdAt,
      evaluatedAt: data.evaluatedAt,
    };
  }

  static toResponses(
    data: {
      jobId: string;
      status: string;
      result?: any | null;
      createdAt?: string;
      evaluatedAt?: string;
    }[],
  ): EvaluationJobResponseDto[] {
    return data.map((v) => this.toResponse(v));
  }
}
