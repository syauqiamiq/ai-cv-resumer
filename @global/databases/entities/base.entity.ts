import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IBaseEntityWithSoftDelete } from '../interfaces/base.interface';
import { IBaseEntity } from '../interfaces/base.interface';

export class BaseEntity implements IBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt?: string;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt?: string;
}

export class BaseEntityWithSoftDelete implements IBaseEntityWithSoftDelete {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt?: string;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt?: string;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt?: string;
}
