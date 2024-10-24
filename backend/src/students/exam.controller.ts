import { Controller, Get, Param } from '@nestjs/common';
import { ExamService } from './exam.service';

@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Get('upcoming/:userId')
  async getUpcomingExams(@Param('userId') userId: string) {
    const id = parseInt(userId, 10);
    if (isNaN(id)) {
      throw new Error('Invalid user ID');
    }
    return this.examService.getUpcomingExamsForStudent(id);
  }
}
