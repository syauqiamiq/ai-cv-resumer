import { PartialType } from '@nestjs/mapped-types';
import { CreateEvaluationJobDto } from './create-evaluation-job.dto';

export class UpdateEvaluationJobDto extends PartialType(
  CreateEvaluationJobDto,
) {}
