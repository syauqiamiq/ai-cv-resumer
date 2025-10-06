import { IBaseEntityWithSoftDelete } from '@global/databases/interfaces/base.interface';
import { IUserAttachment } from './user-attachment.interface';
import { IUser } from './user.interface';

export interface IEvaluationJob extends IBaseEntityWithSoftDelete {
  status: string | null;
  jobTitle: string | null;
  cvResult?: any | null;
  projectResult?: any | null;
  finalResult?: any | null;
  retryCount?: number | null;
  errorMessage?: string | null;
  cvAttachmentId?: string | null;
  projectAttachmentId?: string | null;
  cvAttachment?: IUserAttachment | null;
  projectAttachment?: IUserAttachment | null;
  evaluatedAt?: string | null;
  user?: IUser | null;
}
