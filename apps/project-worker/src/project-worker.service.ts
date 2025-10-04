import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectWorkerService {
  getHello(): string {
    return 'Hello World!';
  }
}
