import { Controller, Get } from '@nestjs/common';
import { CvWorkerService } from './cv-worker.service';

@Controller()
export class CvWorkerController {
  constructor(private readonly cvWorkerService: CvWorkerService) {}

  @Get()
  getHello(): string {
    return this.cvWorkerService.getHello();
  }
}
