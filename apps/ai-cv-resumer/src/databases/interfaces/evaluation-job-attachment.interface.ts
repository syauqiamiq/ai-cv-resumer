import { IBaseEntityWithSoftDelete } from '@global/databases/interfaces/base.interface';
import { IEvaluationJob } from './evaluation-job.interface';

export interface IEvaluationJobAttachment extends IBaseEntityWithSoftDelete {
  evaluationJobId: string | null;
  documentName: string;
  path: string;
  type: string;
  evaluationJob?: IEvaluationJob;
}
