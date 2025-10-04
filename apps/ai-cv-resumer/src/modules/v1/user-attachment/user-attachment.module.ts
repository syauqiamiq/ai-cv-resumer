import { Module } from '@nestjs/common';
import { UserAttachmentService } from './user-attachment.service';
import { UserAttachmentController } from './user-attachment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAttachment } from 'apps/ai-cv-resumer/src/databases/entities/user-attachment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAttachment])],
  controllers: [UserAttachmentController],
  providers: [UserAttachmentService],
})
export class UserAttachmentModule {}
