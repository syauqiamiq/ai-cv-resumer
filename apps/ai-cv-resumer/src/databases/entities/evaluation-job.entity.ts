import { BaseEntityWithSoftDelete } from '@global/databases/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { IEvaluationJob } from '../interfaces/evaluation-job.interface';
import { IUserAttachment } from '../interfaces/user-attachment.interface';
import { UserAttachment } from './user-attachment.entity';
import { IUser } from '../interfaces/user.interface';
import { User } from './user.entity';

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
    name: 'job_description',
    type: 'text',
  })
  jobDescription: string | null;

  @Column({
    name: 'cv_result',
    type: 'jsonb',
    nullable: true,
  })
  cvResult?: any | null;

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
    name: 'user_id',
    type: 'uuid',
    nullable: true,
  })
  userId?: string | null;

  @ManyToOne(() => UserAttachment, (attachment) => attachment.cvEvaluationJob)
  @JoinColumn({ name: 'cv_attachment_id' })
  cvAttachment?: IUserAttachment | null;

  @ManyToOne(() => User, (user) => user.evaluationJobs)
  @JoinColumn({ name: 'user_id' })
  user?: IUser | null;
}
