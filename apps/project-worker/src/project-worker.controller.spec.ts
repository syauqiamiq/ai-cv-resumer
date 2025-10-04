import { Test, TestingModule } from '@nestjs/testing';
import { ProjectWorkerController } from './project-worker.controller';
import { ProjectWorkerService } from './project-worker.service';

describe('ProjectWorkerController', () => {
  let projectWorkerController: ProjectWorkerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProjectWorkerController],
      providers: [ProjectWorkerService],
    }).compile();

    projectWorkerController = app.get<ProjectWorkerController>(ProjectWorkerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(projectWorkerController.getHello()).toBe('Hello World!');
    });
  });
});
