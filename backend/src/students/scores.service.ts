import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateScoreDto } from './dto/create-score.dto'; // Define the DTO for creating a score

@Injectable()
export class ScoresService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Add a new score to the database
   * @param createScoreDto - Data Transfer Object for creating a score
   * @returns The created score record
   */
  async addScore(createScoreDto: CreateScoreDto) {
    const { score, percentage, userId, examId, isManualAssessment } = createScoreDto;

    // Step 1: Validate that the examId exists in the correct table (AddAssessment or ManualAssessment)
    let manualAssessment = null;
    let addAssessment = null;

    if (isManualAssessment) {
      // If it's a manual assessment, check if the examId exists in the ManualAssessment table
      manualAssessment = await this.prisma.manualAssessment.findUnique({
        where: { id: examId },
      });
      if (!manualAssessment) {
        throw new BadRequestException(`Manual assessment with ID ${examId} does not exist`);
      }
    } else {
      // If it's an AddAssessment, check if the examId exists in the AddAssessment table
      addAssessment = await this.prisma.addAssessment.findUnique({
        where: { id: examId },
      });
      if (!addAssessment) {
        throw new BadRequestException(`Add assessment with ID ${examId} does not exist`);
      }
    }

    // Step 2: Create the score record
    try {
      const scoreData: any = {
        score,
        percentage,
        user: {
          connect: { id: userId },
        },
        ...(isManualAssessment
          ? { manualAssessment: { connect: { id: examId } } }
          : { assessment: { connect: { id: examId } } }),
      };

      // Create the score record
      const newScore = await this.prisma.score.create({
        data: scoreData,
      });

      return newScore;
    } catch (error) {
      console.error('Error while creating score:', error);
      throw new BadRequestException('Failed to create score due to foreign key constraint');
    }
  }

  /**
   * Get all scores for a specific student
   * @param studentId - The ID of the student to fetch scores for
   * @returns A list of the student's scores
   */
  async getScoresByStudent(studentId: number) {
    try {
      const scores = await this.prisma.score.findMany({
        where: { userId: studentId },
        include: {
          manualAssessment: true,
          assessment: true,
        },
      });

      return scores;
    } catch (error) {
      console.error('Error while fetching scores:', error);
      throw new BadRequestException('Failed to fetch scores');
    }
  }

  /**
   * Get all scores for a specific exam (manual or regular assessment)
   * @param examId - The ID of the exam to fetch scores for
   * @param isManualAssessment - Flag to determine if the exam is a manual assessment
   * @returns A list of scores for the exam
   */
  async getScoresByExam(examId: number, isManualAssessment: boolean) {
    try {
      const scores = await this.prisma.score.findMany({
        where: isManualAssessment
          ? { manualAssessment: { id: examId } }  // Correct relation field
          : { assessment: { id: examId } },      // Correct relation field
      });
  
      return scores;
    } catch (error) {
      console.error('Error while fetching exam scores:', error);
      throw new BadRequestException('Failed to fetch exam scores');
    }
  }
  
}
