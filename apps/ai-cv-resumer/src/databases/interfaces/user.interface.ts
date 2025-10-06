import { IBaseEntityWithSoftDelete } from '@global/databases/interfaces/base.interface';
import { IEvaluationJob } from './evaluation-job.interface';
import { IUserAttachment } from './user-attachment.interface';

export interface IUser extends IBaseEntityWithSoftDelete {
  name: string;
  email: string;
  password: string;
  evaluationJobs?: IEvaluationJob[];
  userAttachments?: IUserAttachment[];
}
