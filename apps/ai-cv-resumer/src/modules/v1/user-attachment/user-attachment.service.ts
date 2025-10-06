import { S3Service } from '@app/s3';
import { generateUniqueFileName } from '@global/functions/file';
import {
  fileSizeValidation,
  fileTypeValidation,
} from '@global/functions/file-validation';
import { BadRequestException, Injectable } from '@nestjs/common';
import { getUserAttachmentS3Directory } from 'apps/ai-cv-resumer/src/common/functions/s3-directory';
import { UserAttachment } from 'apps/ai-cv-resumer/src/databases/entities/user-attachment.entity';
import { aiCvResumerENVConfig } from 'apps/ai-cv-resumer/src/env.config';
import { DataSource, Repository } from 'typeorm';
import { CreateUserAttachmentDto } from './dto/request/create-user-attachment.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserAttachmentService {
  constructor(
    private readonly s3Service: S3Service,

    private readonly dataSource: DataSource,

    @InjectRepository(UserAttachment)
    private readonly userAttachmentRepository: Repository<UserAttachment>,
  ) {}

  async upload(
    createUserAttachmentDto: CreateUserAttachmentDto,
    file: Express.Multer.File,
    userId: string,
  ) {
    let uploadedS3Path: string | null = null;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (!file) {
        throw new BadRequestException('File is required');
      }
      // Validate file type - only documents and images
      const allowedMimeTypes = ['application/pdf'];
      fileTypeValidation(file, allowedMimeTypes);

      // Validate file size - maximum 5MB
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB in bytes
      fileSizeValidation(file, maxSizeInBytes);

      // Generate unique file name and S3 path
      const uniqueFileName = generateUniqueFileName(file);

      // Generate S3 path
      const s3Path = getUserAttachmentS3Directory(userId, uniqueFileName);
      uploadedS3Path = s3Path;

      // Upload to S3 (MinIO)
      await this.s3Service.uploadFile(
        aiCvResumerENVConfig.aws.s3.bucketName,
        s3Path,
        file.buffer,
        file.mimetype,
      );

      // Save to database
      const newUserAttachment = queryRunner.manager
        .getRepository(UserAttachment)
        .save({
          documentName: file.originalname,
          path: s3Path,
          type: createUserAttachmentDto.type,
          mimeType: file.mimetype,
          size: file.size,
          userId: userId,
        });

      await queryRunner.commitTransaction();

      return newUserAttachment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // Clean up uploaded S3 file if transaction fails
      if (uploadedS3Path) {
        try {
          await this.s3Service.deleteFile(
            aiCvResumerENVConfig.aws.s3.bucketName,
            uploadedS3Path,
          );
        } catch (deleteError) {
          console.error('Failed to cleanup S3 file:', deleteError);
        }
      }

      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getAll(userId: string) {
    return await this.userAttachmentRepository.find({
      where: { userId: userId },
      order: { createdAt: 'DESC' },
    });
  }
}
