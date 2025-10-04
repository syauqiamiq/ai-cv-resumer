import { Test, TestingModule } from '@nestjs/testing';
import { CvWorkerController } from './cv-worker.controller';
import { CvWorkerService } from './cv-worker.service';

describe('CvWorkerController', () => {
  let cvWorkerController: CvWorkerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CvWorkerController],
      providers: [CvWorkerService],
    }).compile();

    cvWorkerController = app.get<CvWorkerController>(CvWorkerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(cvWorkerController.getHello()).toBe('Hello World!');
    });
  });
});
