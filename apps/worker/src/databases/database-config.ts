import { DataSourceOptions } from 'typeorm';

import { EvaluationJob } from './entities/evaluation-job.entity';
import { UserAttachment } from './entities/user-attachment.entity';
import { workerENVConfig } from '../env.config';

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: workerENVConfig.db.host,
  port: workerENVConfig.db.port,
  username: workerENVConfig.db.user,
  password: workerENVConfig.db.password,
  database: workerENVConfig.db.name,
  entities: [EvaluationJob, UserAttachment],
  synchronize: false,
  logging: workerENVConfig.app.env === 'development',
};
