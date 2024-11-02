// src/exam/exam.controller.ts
import { Controller, Post, Body, Put } from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamProgressDto } from './dto/create-exam-progress.dto';
import { ResumeExamDto } from './dto/resume-exam.dto';

@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post('save-progress')
  async saveProgress(@Body() createExamProgressDto: CreateExamProgressDto) {
    return this.examService.saveProgress(createExamProgressDto);
  }

  @Post('resume')
  async resumeExam(@Body() resumeExamDto: ResumeExamDto) {
    const progress = await this.examService.getExamProgress(resumeExamDto);
    if (progress) {
      return {
        message: 'Resuming exam',
        currentQuestion: progress.currentQuestion,
        answers: progress.answers,
        timeSpent: progress.timeSpent,
      };
    }
    return { message: 'No progress found, starting new exam' };
  }

  @Put('complete')
  async completeExam(@Body() completeExamDto: ResumeExamDto) {
    const { studentId, examId } = completeExamDto;
    return this.examService.completeExam(studentId, examId);
  }
}
