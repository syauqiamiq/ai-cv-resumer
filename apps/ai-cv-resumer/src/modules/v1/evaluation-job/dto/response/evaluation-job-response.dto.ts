import { IEvaluationJob } from 'apps/ai-cv-resumer/src/databases/interfaces/evaluation-job.interface';

export class EvaluationJobResponseDto {
  jobId: string;
  status: string;

  static toResponse(data: IEvaluationJob): EvaluationJobResponseDto {
    return {
      jobId: data.id,
      status: data.status,
    };
  }

  static toResponses(data: IEvaluationJob[]): EvaluationJobResponseDto[] {
    return data.map((v) => this.toResponse(v));
  }
}
