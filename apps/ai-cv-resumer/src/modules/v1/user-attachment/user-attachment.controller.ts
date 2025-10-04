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
} from '@nestjs/common';
import { UserAttachmentService } from './user-attachment.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserAttachmentDto } from './dto/request/create-user-attachment.dto';
import { IApiResponse } from '@global/interfaces/response.interface';
import { UserAttachmentResponseDto } from './dto/response/user-attachment-response.dto';

@Controller('user-attachment')
export class UserAttachmentController {
  constructor(private readonly userAttachmentService: UserAttachmentService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Body() createUserAttachmentDto: CreateUserAttachmentDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IApiResponse<UserAttachmentResponseDto>> {
    const result = await this.userAttachmentService.upload(
      createUserAttachmentDto,
      file,
    );
    return {
      message: 'File uploaded successfully',
      data: UserAttachmentResponseDto.toResponse(result),
    };
  }

  @Get()
  async getAll(): Promise<IApiResponse<UserAttachmentResponseDto[]>> {
    const result = await this.userAttachmentService.getAll();
    return {
      message: 'User attachments retrieved successfully',
      data: UserAttachmentResponseDto.toResponses(result),
    };
  }
}
