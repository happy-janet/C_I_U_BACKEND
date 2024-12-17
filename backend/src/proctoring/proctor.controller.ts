import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ProctorService } from './proctor.service';

@Controller('exams')
export class ProctorController {
  constructor(private readonly proctorService: ProctorService) {}

  @Get('active')
  async getActiveExams() {
    try {
      return await this.proctorService.getActiveExams();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('No active exams found');
      }
      throw new Error('Failed to fetch active exams');
    }
  }
}