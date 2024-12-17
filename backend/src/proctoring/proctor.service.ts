import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProctorService {
  constructor(private prisma: PrismaService) {}

  async getActiveExams() {
    const now = new Date();
    const activeExams = await this.prisma.addAssessment.findMany({
      where: {
        isDraft: false,
        startTime: { lte: now },
        endTime: { gte: now },
      },
      select: {
        id: true,
        title: true,
        courseUnit: true,
        startTime: true,
        endTime: true,
        duration: true,
        status: true,
        isPublished: true,
      },
    });

    if (!activeExams.length) {
      throw new NotFoundException('No active exams found');
    }

    return activeExams;
  }
}