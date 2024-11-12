import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateScoreDto } from './dto/create-score.dto';

@Injectable()
export class ScoreService {
  constructor(private prisma: PrismaService) {}

  // Method to create a new score for the user
  async createScore(createScoreDto: CreateScoreDto) {
    try {
      const { examId, userId, score, percentage, isManualAssessment } = createScoreDto;
  
      if (!examId || !userId) {
        console.error('Validation failed: Both examId and userId are required');
        throw new Error('Both examId and userId are required.');
      }
  
      console.log('Received examId:', examId, 'userId:', userId);
  
      const data = {
        score,
        percentage,
        student: {
          connect: { id: userId },
        },
        ...(isManualAssessment
          ? { manualAssessment: { connect: { id: examId } } }
          : { assessment: { connect: { id: examId } } }),
      };
  
      const scoreRecord = await this.prisma.score.create({ data });
      console.log('Score successfully created:', scoreRecord);
  
      return scoreRecord;
    } catch (error) {
      console.error('Error creating score:', error.message || error);
      throw new Error('Failed to create score');
    }
  }
}  