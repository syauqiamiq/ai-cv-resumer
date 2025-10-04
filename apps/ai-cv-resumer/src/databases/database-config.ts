import { DataSourceOptions } from 'typeorm';
import { aiCvResumerENVConfig } from '../env.config';
import { EvaluationJob } from './entities/evaluation-job.entity';
import { UserAttachment } from './entities/user-attachment.entity';

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: aiCvResumerENVConfig.db.host,
  port: aiCvResumerENVConfig.db.port,
  username: aiCvResumerENVConfig.db.user,
  password: aiCvResumerENVConfig.db.password,
  database: aiCvResumerENVConfig.db.name,
  entities: [EvaluationJob, UserAttachment],
  synchronize: true,
  logging: aiCvResumerENVConfig.app.env === 'development',
};
