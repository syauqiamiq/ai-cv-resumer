import { BaseEntityWithSoftDelete } from '@global/databases/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { IEvaluationJob } from '../interfaces/evaluation-job.interface';
import { EvaluationJob } from './evaluation-job.entity';
import { IUserAttachment } from '../interfaces/user-attachment.interface';
import { User } from './user.entity';
import { IUser } from '../interfaces/user.interface';

@Entity('user_attachments')
export class UserAttachment
  extends BaseEntityWithSoftDelete
  implements IUserAttachment
{
  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: true,
  })
  userId?: string | null;

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

  @Column({
    name: 'mime_type',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  mimeType?: string;

  @Column({
    name: 'size',
    type: 'bigint',
    nullable: true,
  })
  size?: number;

  @OneToMany(() => EvaluationJob, (evaluationJob) => evaluationJob.cvAttachment)
  @JoinColumn({ name: 'cv_attachment_id' })
  cvEvaluationJob?: IEvaluationJob;

  @ManyToOne(() => User, (user) => user.userAttachments)
  @JoinColumn({ name: 'user_id' })
  user?: IUser | null;
}
