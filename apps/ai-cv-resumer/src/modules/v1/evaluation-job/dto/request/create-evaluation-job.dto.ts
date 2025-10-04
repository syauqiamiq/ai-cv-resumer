import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateEvaluationJobDto {
  @IsNotEmpty()
  @IsUUID()
  cvAttachmentId: string;

  @IsNotEmpty()
  @IsUUID()
  projectAttachmentId: string;

  @IsNotEmpty()
  @IsString()
  jobTitle: string;
}
