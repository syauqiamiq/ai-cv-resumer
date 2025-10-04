import { IUserAttachment } from 'apps/ai-cv-resumer/src/databases/interfaces/user-attachment.interface';

export class UserAttachmentResponseDto implements Partial<IUserAttachment> {
  id: string;
  documentName: string;
  path: string;
  type: string;
  mimeType?: string;
  size?: number;
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
