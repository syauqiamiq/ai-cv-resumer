import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EvaluationJobService } from './evaluation-job.service';
import { CreateEvaluationJobDto } from './dto/request/create-evaluation-job.dto';
import { UpdateEvaluationJobDto } from './dto/request/update-evaluation-job.dto';

@Controller()
export class EvaluationJobController {
  constructor(private readonly evaluationJobService: EvaluationJobService) {}

  @MessagePattern('createEvaluationJob')
  async createEvaluationJob(
    @Payload() createEvaluationJobDto: CreateEvaluationJobDto,
  ) {
    return this.evaluationJobService.executeEvaluationJob(
      createEvaluationJobDto,
    );
  }
}
