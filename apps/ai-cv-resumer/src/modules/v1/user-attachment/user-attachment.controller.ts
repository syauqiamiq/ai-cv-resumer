import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { UserAttachmentService } from './user-attachment.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserAttachmentDto } from './dto/request/create-user-attachment.dto';
import { IApiResponse } from '@global/interfaces/response.interface';
import { UserAttachmentResponseDto } from './dto/response/user-attachment-response.dto';
import { JwtGuard } from 'apps/ai-cv-resumer/src/common/guard/jwt.guard';
import { IEnhanceRequest } from 'apps/ai-cv-resumer/src/common/interfaces/request.interface';

@ApiTags('User Attachments')
@Controller('user-attachment')
export class UserAttachmentController {
  constructor(private readonly userAttachmentService: UserAttachmentService) {}

  @Post()
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Upload user attachment',
    description:
      'Upload a file attachment (CV, project report, or portfolio) for the authenticated user. Supports PDF formats with a maximum size of 5MB.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload with attachment type',
    type: CreateUserAttachmentDto,
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: UserAttachmentResponseDto,
  })
  async upload(
    @Req() request: IEnhanceRequest,
    @Body() createUserAttachmentDto: CreateUserAttachmentDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IApiResponse<UserAttachmentResponseDto>> {
    const result = await this.userAttachmentService.upload(
      createUserAttachmentDto,
      file,
      request.tokenPayload.userId,
    );
    return {
      message: 'File uploaded successfully',
      data: UserAttachmentResponseDto.toResponse(result),
    };
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all user attachments',
    description:
      'Retrieve all file attachments uploaded by the authenticated user, including CVs, project reports.',
  })
  @ApiResponse({
    status: 200,
    description: 'User attachments retrieved successfully',
    type: [UserAttachmentResponseDto],
  })
  async getAll(
    @Req() request: IEnhanceRequest,
  ): Promise<IApiResponse<UserAttachmentResponseDto[]>> {
    const result = await this.userAttachmentService.getAll(
      request.tokenPayload.userId,
    );
    return {
      message: 'User attachments retrieved successfully',
      data: UserAttachmentResponseDto.toResponses(result),
    };
  }
}
