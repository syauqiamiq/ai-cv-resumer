import { Test, TestingModule } from '@nestjs/testing';
import { KafkaMqService } from './kafka-mq.service';

describe('KafkaMqService', () => {
  let service: KafkaMqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KafkaMqService],
    }).compile();

    service = module.get<KafkaMqService>(KafkaMqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
