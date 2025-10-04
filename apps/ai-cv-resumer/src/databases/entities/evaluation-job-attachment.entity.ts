import { BaseEntityWithSoftDelete } from '@global/databases/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { IEvaluationJobAttachment } from '../interfaces/evaluation-job-attachment.interface';
import { IEvaluationJob } from '../interfaces/evaluation-job.interface';
import { EvaluationJob } from './evaluation-job.entity';

@Entity('evaluation_job_attachments')
export class EvaluationJobAttachment
  extends BaseEntityWithSoftDelete
  implements IEvaluationJobAttachment
{
  @Column({
    name: 'evaluation_job_id',
    type: 'uuid',
  })
  evaluationJobId: string | null;

  @Column({
    name: 'document_name',
    type: 'varchar',
    length: 255,
  })
  documentName: string;

  @Column({
    name: 'path',
    type: 'varchar',
    length: 255,
  })
  path: string;

  @Column({
    name: 'type',
    type: 'varchar',
    length: 255,
  })
  type: string;

  @ManyToOne(
    () => EvaluationJob,
    (evaluationJob) => evaluationJob.jobAttachments,
  )
  @JoinColumn({ name: 'evaluation_job_id' })
  evaluationJob?: IEvaluationJob;
}
