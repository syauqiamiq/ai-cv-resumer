import { BaseEntityWithSoftDelete } from '@global/databases/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { IEvaluationJob } from '../interfaces/evaluation-job.interface';
import { IUserAttachment } from '../interfaces/user-attachment.interface';
import { UserAttachment } from './user-attachment.entity';

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
    name: 'job_title',
    type: 'varchar',
  })
  jobTitle: string | null;

  @Column({
    name: 'cv_result',
    type: 'jsonb',
    nullable: true,
  })
  cvResult?: any | null;

  @Column({
    name: 'project_result',
    type: 'jsonb',
    nullable: true,
  })
  projectResult?: any | null;

  @Column({
    name: 'final_result',
    type: 'jsonb',
    nullable: true,
  })
  finalResult?: any | null;

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

  @Column({
    name: 'cv_attachment_id',
    type: 'uuid',
    nullable: true,
  })
  cvAttachmentId?: string | null;

  @Column({
    name: 'project_attachment_id',
    type: 'uuid',
    nullable: true,
  })
  projectAttachmentId?: string | null;

  @ManyToOne(() => UserAttachment, (attachment) => attachment.cvEvaluationJob)
  @JoinColumn({ name: 'cv_attachment_id' })
  cvAttachment?: IUserAttachment | null;

  @ManyToOne(
    () => UserAttachment,
    (attachment) => attachment.projectEvaluationJob,
  )
  @JoinColumn({ name: 'project_attachment_id' })
  projectAttachment?: IUserAttachment | null;
}
