import {
  Controller,
  Patch,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ExamProgressService } from './exam-progress.service';
import { UpdateExamProgressDto, ResumeExamDto } from './dto/exam-progress.dto';

@Controller('exam-progress')
export class ExamProgressController {
  constructor(private readonly examProgressService: ExamProgressService) {}

  @Patch('update/:studentId')
  async updateProgress(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body() dto: UpdateExamProgressDto,
  ) {
    return this.examProgressService.updateProgress(studentId, dto);
  }

  @Get('resume/:studentId')
  async resumeExam(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query() dto: ResumeExamDto, // Using @Query since GET requests typically have no body
  ) {
    return this.examProgressService.resumeExam(studentId, dto);
  }
}
