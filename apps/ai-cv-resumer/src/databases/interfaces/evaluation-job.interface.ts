import { IBaseEntityWithSoftDelete } from '@global/databases/interfaces/base.interface';
import { IUserAttachment } from './user-attachment.interface';

export interface IEvaluationJob extends IBaseEntityWithSoftDelete {
  status: string | null;
  jobTitle: string | null;
  cv_result?: string | null;
  project_result?: string | null;
  final_result?: string | null;
  retryCount?: number | null;
  errorMessage?: string | null;
  cvAttachmentId?: string | null;
  projectAttachmentId?: string | null;
  cvAttachment?: IUserAttachment | null;
  projectAttachment?: IUserAttachment | null;
  evaluatedAt?: string | null;
}
