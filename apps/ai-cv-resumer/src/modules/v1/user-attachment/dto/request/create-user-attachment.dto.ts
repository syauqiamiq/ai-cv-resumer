import { EUserAttachmentType } from 'apps/ai-cv-resumer/src/common/enums/user-attachment-type.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateUserAttachmentDto {
  @IsEnum(EUserAttachmentType)
  @IsNotEmpty()
  type: EUserAttachmentType;
}
