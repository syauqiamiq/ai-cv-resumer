import { Controller, Get, Param, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EvaluationJobService } from './evaluation-job.service';
import { CreateEvaluationJobDto } from './dto/request/create-evaluation-job.dto';
import { UpdateEvaluationJobDto } from './dto/request/update-evaluation-job.dto';
import { IApiResponse } from '@global/interfaces/response.interface';
import { EvaluationJobResponseDto } from './dto/response/evaluation-job-response.dto';

@Controller()
export class EvaluationJobController {
  constructor(private readonly evaluationJobService: EvaluationJobService) {}

  // @Get('trigger-rag')
  // async triggerRag(): Promise<IApiResponse<EvaluationJobResponseDto>> {
  //   await this.evaluationJobService.triggerRAG();
  //   return {
  //     message: 'RAG triggered successfully',
  //     data: null,
  //   };
  // }

  @Post('evaluate')
  async createEvaluationJob(
    @Payload() createEvaluationJobDto: CreateEvaluationJobDto,
  ): Promise<IApiResponse<EvaluationJobResponseDto>> {
    const result = await this.evaluationJobService.executeEvaluationJob(
      createEvaluationJobDto,
    );
    return {
      message: 'This action adds a new evaluationJob',
      data: EvaluationJobResponseDto.toResponse(result),
    };
  }

  @Get('result/:jobId')
  async getResultByJobId(
    @Param('jobId') jobId: string,
  ): Promise<IApiResponse<EvaluationJobResponseDto>> {
    const result = await this.evaluationJobService.resultByJobId(jobId);
    return {
      message: 'Evaluation job result retrieved successfully',
      data: EvaluationJobResponseDto.toResponse(result),
    };
  }
}
