import { Module } from '@nestjs/common';
import { KafkaMqService } from './kafka-mq.service';

@Module({
  providers: [KafkaMqService],
  exports: [KafkaMqService],
})
export class KafkaMqModule {}
