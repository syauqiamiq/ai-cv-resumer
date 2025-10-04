import { Module } from '@nestjs/common';
import { CvWorkerController } from './cv-worker.controller';
import { CvWorkerService } from './cv-worker.service';

@Module({
  imports: [],
  controllers: [CvWorkerController],
  providers: [CvWorkerService],
})
export class CvWorkerModule {}
