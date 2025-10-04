import { Controller, Get } from '@nestjs/common';
import { ProjectWorkerService } from './project-worker.service';

@Controller()
export class ProjectWorkerController {
  constructor(private readonly projectWorkerService: ProjectWorkerService) {}

  @Get()
  getHello(): string {
    return this.projectWorkerService.getHello();
  }
}
