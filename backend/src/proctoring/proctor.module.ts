import { Module } from '@nestjs/common';
import { ProctorGateway } from '../proctoring/proctor.gateway';

@Module({
  providers: [ProctorGateway],
})
export class ProctorModule {}