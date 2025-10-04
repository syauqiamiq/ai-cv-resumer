import { IBaseEntityWithSoftDelete } from '@global/databases/interfaces/base.interface';
import { IEvaluationJobAttachment } from './evaluation-job-attachment.interface';

export interface IEvaluationJob extends IBaseEntityWithSoftDelete {
  status: string | null;
  cv_result?: string | null;
  project_result?: string | null;
  final_result?: string | null;
  retryCount?: number | null;
  errorMessage?: string | null;
  evaluatedAt?: string | null;
  jobAttachments?: IEvaluationJobAttachment[] | null;
}
