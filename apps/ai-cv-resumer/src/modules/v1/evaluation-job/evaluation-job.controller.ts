import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EvaluationJobService } from './evaluation-job.service';
import { CreateEvaluationJobDto } from './dto/request/create-evaluation-job.dto';
import { UpdateEvaluationJobDto } from './dto/request/update-evaluation-job.dto';
import { IApiResponse } from '@global/interfaces/response.interface';
import { EvaluationJobResponseDto } from './dto/response/evaluation-job-response.dto';
import { JwtGuard } from 'apps/ai-cv-resumer/src/common/guard/jwt.guard';
import { IEnhanceRequest } from 'apps/ai-cv-resumer/src/common/interfaces/request.interface';

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
  @UseGuards(JwtGuard)
  async createEvaluationJob(
    @Req() request: IEnhanceRequest,
    @Payload() createEvaluationJobDto: CreateEvaluationJobDto,
  ): Promise<IApiResponse<EvaluationJobResponseDto>> {
    const result = await this.evaluationJobService.executeEvaluationJob(
      createEvaluationJobDto,
      request.tokenPayload.userId,
    );
    return {
      message: 'This action adds a new evaluationJob',
      data: EvaluationJobResponseDto.toResponse(result),
    };
  }

  @Post('retry/:jobId')
  @UseGuards(JwtGuard)
  async retryEvaluationJob(
    @Req() request: IEnhanceRequest,
    @Param('jobId') jobId: string,
  ): Promise<IApiResponse<EvaluationJobResponseDto>> {
    const result = await this.evaluationJobService.retryEvaluationJobById(
      jobId,
      request.tokenPayload.userId,
    );
    return {
      message: 'This action retries an existing evaluationJob',
      data: EvaluationJobResponseDto.toResponse(result),
    };
  }

  @Get('result/:jobId')
  @UseGuards(JwtGuard)
  async getResultByJobId(
    @Req() request: IEnhanceRequest,
    @Param('jobId') jobId: string,
  ): Promise<IApiResponse<EvaluationJobResponseDto>> {
    const result = await this.evaluationJobService.resultByJobId(
      jobId,
      request.tokenPayload.userId,
    );
    return {
      message: 'Evaluation job result retrieved successfully',
      data: EvaluationJobResponseDto.toResponse(result),
    };
  }
}
