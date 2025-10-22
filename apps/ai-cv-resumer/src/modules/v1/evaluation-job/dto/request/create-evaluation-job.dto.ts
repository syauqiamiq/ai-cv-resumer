import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateEvaluationJobDto {
  @ApiProperty({
    description: 'UUID of the CV attachment to be evaluated',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsUUID()
  cvAttachmentId: string;

  @ApiProperty({
    description: 'Description of the job position for evaluation context',
    example: 'Develop and maintain backend services',
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  jobDescription: string;

  @ApiProperty({
    description: 'Title of the job position for evaluation context',
    example: 'Backend Engineer',
    minLength: 1,
    maxLength: 200,
  })
  @IsNotEmpty()
  @IsString()
  jobTitle: string;
}
