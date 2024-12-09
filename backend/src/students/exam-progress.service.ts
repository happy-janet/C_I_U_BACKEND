import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Adjust path if necessary
import { UpdateExamProgressDto, ResumeExamDto } from './dto/exam-progress.dto';

@Injectable()
export class ExamProgressService {
  constructor(private prisma: PrismaService) {}

  async updateProgress(studentId: number, dto: UpdateExamProgressDto) {
    const progress = await this.prisma.examProgress.findFirst({
      where: { studentId, isCompleted: false },
    });

    if (!progress) {
      throw new NotFoundException('No ongoing exam found');
    }

    return this.prisma.examProgress.update({
      where: { id: progress.id },
      data: { ...dto, updatedAt: new Date() },
    });
  }

  async resumeExam(studentId: number, dto: ResumeExamDto) {
    const { addAssessmentId, manualAssessmentId } = dto;

    const progress = await this.prisma.examProgress.findFirst({
      where: {
        studentId,
        isCompleted: false,
        OR: [
          addAssessmentId ? { addAssessmentId } : undefined,
          manualAssessmentId ? { manualAssessmentId } : undefined,
        ].filter(Boolean), // Removes undefined from the OR array
      },
    });

    if (!progress) {
      throw new NotFoundException('No ongoing exam to resume');
    }

    return progress;
  }
}
