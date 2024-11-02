import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  customQuestion: any;

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Method to save or update exam progress for resumption purposes
  async saveExamProgress(studentId: number, examId: number, currentQuestion: number, answers: any, timeSpent: number) {
    return this.examProgress.upsert({
      where: {
        studentId_examId: { studentId, examId },
      },
      update: {
        currentQuestion,
        answers,
        timeSpent,
        status: 'in-progress', // or another default status as required
      },
      create: {
        studentId,
        examId,
        currentQuestion,
        answers,
        timeSpent,
        status: 'in-progress', // or another default status as required
      },
    });
  }

  // Method to retrieve exam progress for resumption
  async getExamProgress(studentId: number, examId: number) {
    return this.examProgress.findUnique({
      where: {
        studentId_examId: { studentId, examId },
      },
    });
  }
}
