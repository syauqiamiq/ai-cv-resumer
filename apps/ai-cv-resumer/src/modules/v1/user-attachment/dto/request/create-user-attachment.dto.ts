import { ApiProperty } from '@nestjs/swagger';
import { EUserAttachmentType } from 'apps/ai-cv-resumer/src/common/enums/user-attachment-type.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateUserAttachmentDto {
  @ApiProperty({
    description: 'Type of user attachment',
    enum: EUserAttachmentType,
    example: EUserAttachmentType.CV,
    enumName: 'EUserAttachmentType',
  })
  @IsEnum(EUserAttachmentType)
  @IsNotEmpty()
  type: EUserAttachmentType;

  @ApiProperty({
    description: 'File to be uploaded',
    type: 'string',
    format: 'binary',
  })
  file: Express.Multer.File;
}
