import { PartialType } from '@nestjs/swagger';
import { CreateUserAttachmentDto } from './create-user-attachment.dto';

export class UpdateUserAttachmentDto extends PartialType(
  CreateUserAttachmentDto,
) {}
