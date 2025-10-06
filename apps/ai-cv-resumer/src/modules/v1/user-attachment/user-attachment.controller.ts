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
import { UserAttachmentService } from './user-attachment.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserAttachmentDto } from './dto/request/create-user-attachment.dto';
import { IApiResponse } from '@global/interfaces/response.interface';
import { UserAttachmentResponseDto } from './dto/response/user-attachment-response.dto';
import { JwtGuard } from 'apps/ai-cv-resumer/src/common/guard/jwt.guard';
import { IEnhanceRequest } from 'apps/ai-cv-resumer/src/common/interfaces/request.interface';

@Controller('user-attachment')
export class UserAttachmentController {
  constructor(private readonly userAttachmentService: UserAttachmentService) {}

  @Post()
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
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
