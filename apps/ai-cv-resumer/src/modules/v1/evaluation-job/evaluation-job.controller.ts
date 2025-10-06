import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { EvaluationJobService } from './evaluation-job.service';
import { CreateEvaluationJobDto } from './dto/request/create-evaluation-job.dto';
import { UpdateEvaluationJobDto } from './dto/request/update-evaluation-job.dto';
import { IApiResponse } from '@global/interfaces/response.interface';
import { EvaluationJobResponseDto } from './dto/response/evaluation-job-response.dto';
import { JwtGuard } from 'apps/ai-cv-resumer/src/common/guard/jwt.guard';
import { IEnhanceRequest } from 'apps/ai-cv-resumer/src/common/interfaces/request.interface';

@ApiTags('Evaluation Jobs')
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create and execute evaluation job',
    description:
      "Creates a new evaluation job to analyze CV and project report against job requirements using AI. The system will evaluate the candidate's cv, project report, and provide comprehensive feedback.",
  })
  @ApiBody({
    type: CreateEvaluationJobDto,
    description:
      'Evaluation job creation payload containing CV, project report, and job details',
  })
  @ApiResponse({
    status: 201,
    description:
      'Evaluation job created successfully and queued for processing',
    type: EvaluationJobResponseDto,
  })
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retry failed evaluation job',
    description:
      'Retries a previously failed evaluation job by re-queuing it for processing. Only failed jobs can be retried.',
  })
  @ApiParam({
    name: 'jobId',
    description: 'UUID of the evaluation job to retry',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Evaluation job retried successfully',
    type: EvaluationJobResponseDto,
  })
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get evaluation job result',
    description:
      'Retrieves the detailed results of a completed evaluation job, including CV analysis, project assessment, and overall recommendation.',
  })
  @ApiParam({
    name: 'jobId',
    description: 'UUID of the evaluation job to get results for',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Evaluation job result retrieved successfully',
    type: EvaluationJobResponseDto,
  })
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
