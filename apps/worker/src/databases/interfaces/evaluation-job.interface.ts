import { IBaseEntityWithSoftDelete } from '@global/databases/interfaces/base.interface';
import { IUserAttachment } from './user-attachment.interface';

export interface IEvaluationJob extends IBaseEntityWithSoftDelete {
  status: string | null;
  jobTitle: string | null;
  jobDescription: string | null;
  cvResult?: any | null;
  finalResult?: any | null;
  retryCount?: number | null;
  errorMessage?: string | null;
  cvAttachmentId?: string | null;
  cvAttachment?: IUserAttachment | null;
  evaluatedAt?: string | null;
}
