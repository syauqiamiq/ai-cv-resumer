import { IEvaluationJob } from 'apps/ai-cv-resumer/src/databases/interfaces/evaluation-job.interface';

export class EvaluationJobResponseDto {
  jobId: string;
  status: string;
  result?: any | null;

  static toResponse(data: {
    jobId: string;
    status: string;
    result?: any | null;
  }): EvaluationJobResponseDto {
    return {
      jobId: data.jobId,
      status: data.status,
      result: data.result,
    };
  }

  static toResponses(
    data: { jobId: string; status: string; result?: any | null }[],
  ): EvaluationJobResponseDto[] {
    return data.map((v) => this.toResponse(v));
  }
}
