import { Controller, Post, Body, Param, Get ,Query} from '@nestjs/common';
import {  ExamMonitoringService } from './signaling.service';

// Controller to expose exam monitoring endpoints
@Controller('exam-monitoring')
export class ExamMonitoringController {
  constructor(private examMonitoringService: ExamMonitoringService) {}

  @Post('create-room')
  async createExamRoom(@Body() body: { examId: string }) {
    return this.examMonitoringService.createExamRoom(body.examId);
  }

  @Get('room-participants/:roomSid')
  async getRoomParticipants(@Param('roomSid') roomSid: string) {
    return this.examMonitoringService.listRoomParticipants(roomSid);
  }

  @Get('generate-token')
  async generateToken(
    @Query('identity') identity: string, 
    @Query('roomName') roomName: string
  ) {
    return {
      token: this.examMonitoringService.generateAccessToken(identity, roomName)
    };
  }
}