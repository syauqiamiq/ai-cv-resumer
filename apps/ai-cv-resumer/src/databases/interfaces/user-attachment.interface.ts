import { IBaseEntityWithSoftDelete } from '@global/databases/interfaces/base.interface';
import { IEvaluationJob } from './evaluation-job.interface';
import { IUser } from './user.interface';

export interface IUserAttachment extends IBaseEntityWithSoftDelete {
  documentName: string;
  path: string;
  type: string;
  mimeType?: string;
  size?: number;
  cvEvaluationJob?: IEvaluationJob;
  projectEvaluationJob?: IEvaluationJob;
  user?: IUser | null;
}
