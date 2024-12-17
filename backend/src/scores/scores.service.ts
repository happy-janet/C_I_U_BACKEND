import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Score } from '@prisma/client';

@Injectable()
export class ScoresService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new score
  async createScore(
    score: number,
    percentage: number,
    userId: number,
    examId?: number,
    assessmentType?: 'add' | 'manual',
  ): Promise<Score> {
    const data: any = {
      score,
      percentage,
      student: { connect: { id: userId } },
    };

    console.log('Received Parameters:', {
      score,
      percentage,
      userId,
      examId,
      assessmentType,
    });

    if (examId && assessmentType === 'add') {
      console.log('Attempting to connect addAssessment');
      const addAssessment = await this.prisma.addAssessment.findUnique({
        where: { id: examId },
      });
      if (addAssessment) {
        data.addAssessment = { connect: { id: examId } };
        console.log('Connected addAssessmentId:', examId);
      } else {
        throw new Error(`addAssessment with ID ${examId} not found.`);
      }
    }

    if (examId && assessmentType === 'manual') {
      console.log('Attempting to connect manualAssessment');
      const manualAssessment = await this.prisma.manualAssessment.findUnique({
        where: { id: examId },
      });
      if (manualAssessment) {
        data.manualAssessment = { connect: { id: examId } };
        console.log('Connected manualAssessmentId:', examId);
      } else {
        throw new Error(`manualAssessment with ID ${examId} not found.`);
      }
    }

    console.log('Final Data for Score Creation:', data);

    try {
      const createdScore = await this.prisma.score.create({ data });
      console.log('Created Score:', createdScore);
      return createdScore;
    } catch (error) {
      const err = error as any;
      console.error('Error creating score:', err.message);
      throw new Error(`Error creating score: ${err.message}`);
    }
  }

  // Get all scores
  async getAllScores(): Promise<Score[]> {
    return this.prisma.score.findMany();
  }

  //Get a specific assessment's scores
  async getScoresByAssessmentId(addAssessmentId: number): Promise<Score[]> {
    return this.prisma.score.findMany({
      where: {
        addAssessmentId: addAssessmentId,
      },
      include: {
        student: true,
        addAssessment: true,
      },
    });
  }

  // Get scores for a specific user
  async getScoresByUserId(userId: number): Promise<Score[]> {
    return this.prisma.score.findMany({
      where: {
        student: {
          id: userId, // Ensure this matches your Prisma schema
        },
      },
    });
  }

  // Update an existing score
  async updateScore(
    scoreId: number,
    score: number,
    percentage: number,
    examId?: number,
  ): Promise<Score> {
    const data: any = { score, percentage };
    if (examId) {
      data.examId = examId;
    }
    return this.prisma.score.update({
      where: { id: scoreId },
      data,
    });
  }

  // Delete a score
  async deleteScore(scoreId: number): Promise<Score> {
    return this.prisma.score.delete({
      where: { id: scoreId },
    });
  }
}
