import { BaseEntityWithSoftDelete } from '@global/databases/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { IEvaluationJobAttachment } from '../interfaces/evaluation-job-attachment.interface';
import { IEvaluationJob } from '../interfaces/evaluation-job.interface';
import { EvaluationJobAttachment } from './evaluation-job-attachment.entity';

@Entity('evaluation_jobs')
export class EvaluationJob
  extends BaseEntityWithSoftDelete
  implements IEvaluationJob
{
  @Column({
    name: 'status',
    type: 'varchar',
  })
  status: string | null;

  @Column({
    name: 'cv_result',
    type: 'jsonb',
    nullable: true,
  })
  cv_result?: string | null;

  @Column({
    name: 'project_result',
    type: 'jsonb',
    nullable: true,
  })
  project_result?: string | null;

  @Column({
    name: 'final_result',
    type: 'jsonb',
    nullable: true,
  })
  final_result?: string | null;

  @Column({
    name: 'retry_count',
    type: 'int',
    nullable: true,
    default: 0,
  })
  retryCount?: number | null;

  @Column({
    name: 'error_message',
    type: 'text',
    nullable: true,
  })
  errorMessage?: string | null;

  @Column({
    name: 'evaluated_at',
    type: 'timestamp',
    nullable: true,
  })
  evaluatedAt?: string | null;

  @OneToMany(
    () => EvaluationJobAttachment,
    (attachment) => attachment.evaluationJob,
  )
  @JoinColumn({ name: 'evaluation_job_id' })
  jobAttachments?: IEvaluationJobAttachment[] | null;
}
