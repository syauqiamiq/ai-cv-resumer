import { Module } from '@nestjs/common';
import { ProjectWorkerController } from './project-worker.controller';
import { ProjectWorkerService } from './project-worker.service';

@Module({
  imports: [],
  controllers: [ProjectWorkerController],
  providers: [ProjectWorkerService],
})
export class ProjectWorkerModule {}
