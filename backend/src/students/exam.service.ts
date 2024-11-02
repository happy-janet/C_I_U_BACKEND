// src/exam/exam.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateExamProgressDto } from './dto/create-exam-progress.dto';
import { ResumeExamDto } from './dto/resume-exam.dto';

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  async saveProgress(createExamProgressDto: CreateExamProgressDto) {
    const { studentId, examId, currentQuestion, answers, timeSpent } = createExamProgressDto;

    return this.prisma.examProgress.upsert({
      where: {
        studentId_examId: { studentId, examId },
      },
      update: {
        currentQuestion,
        answers,
        timeSpent,
        status: 'in-progress',
      },
      create: {
        studentId,
        examId,
        currentQuestion,
        answers,
        timeSpent,
        status: 'in-progress',
      },
    });
  }

  async getExamProgress(resumeExamDto: ResumeExamDto) {
    const { studentId, examId } = resumeExamDto;
    return this.prisma.examProgress.findFirst({
      where: { studentId, examId, status: 'in-progress' },
    });
  }

  async completeExam(studentId: number, examId: number) {
    return this.prisma.examProgress.updateMany({
      where: { studentId, examId },
      data: { status: 'completed' },
    });
  }
}
