import { Module } from '@nestjs/common';
import {  ExamMonitoringService } from './signaling.service';
import { ConfigModule } from '@nestjs/config';


@Module({
  providers: [ ExamMonitoringService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
  ],
})
export class SignalingModule {}
