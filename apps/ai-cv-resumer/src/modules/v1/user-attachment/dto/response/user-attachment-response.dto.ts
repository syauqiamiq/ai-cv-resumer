import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IUserAttachment } from 'apps/ai-cv-resumer/src/databases/interfaces/user-attachment.interface';

export class UserAttachmentResponseDto implements Partial<IUserAttachment> {
  @ApiProperty({
    description: 'Unique identifier for the user attachment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the uploaded document',
    example: 'john_doe_cv.pdf',
  })
  documentName: string;

  @ApiProperty({
    description: 'Storage path of the document',
    example:
      'attachments/users/123e4567-e89b-12d3-a456-426614174000/cv/john_doe_cv.pdf',
  })
  path: string;

  @ApiProperty({
    description: 'Type of the attachment',
    example: 'CV',
    enum: ['CV', 'PROJECT_REPORT', 'PORTFOLIO'],
  })
  type: string;

  @ApiPropertyOptional({
    description: 'MIME type of the uploaded file',
    example: 'application/pdf',
  })
  mimeType?: string;

  @ApiPropertyOptional({
    description: 'Size of the file in bytes',
    example: 2048576,
  })
  size?: number;

  @ApiPropertyOptional({
    description: 'Timestamp when the attachment was created',
    example: '2025-10-06T12:00:00Z',
  })
  createdAt?: string;

  static toResponse(data: IUserAttachment): UserAttachmentResponseDto {
    return {
      id: data.id,
      documentName: data.documentName,
      path: data.path,
      type: data.type,
      mimeType: data.mimeType,
      size: data.size,
      createdAt: data.createdAt,
    };
  }

  static toResponses(data: IUserAttachment[]): UserAttachmentResponseDto[] {
    return data.map((v) => this.toResponse(v));
  }
}
