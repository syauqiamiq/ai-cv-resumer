import { BaseEntityWithSoftDelete } from '@global/databases/entities/base.entity';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';

import { IEvaluationJob } from '../interfaces/evaluation-job.interface';
import { EvaluationJob } from './evaluation-job.entity';
import { IUserAttachment } from '../interfaces/user-attachment.interface';
import { IUser } from '../interfaces/user.interface';
import { UserAttachment } from './user-attachment.entity';

@Entity('users')
export class User extends BaseEntityWithSoftDelete implements IUser {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
  })
  password: string;

  @OneToMany(() => EvaluationJob, (evaluationJob) => evaluationJob.user)
  evaluationJobs?: IEvaluationJob[];

  @OneToMany(() => UserAttachment, (userAttachment) => userAttachment.user)
  userAttachments?: IUserAttachment[];
}
