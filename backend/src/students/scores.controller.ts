import { Controller, Get, Post, Body, Param, Put, Delete,ParseIntPipe, Patch, Res} from '@nestjs/common';
import { ScoresService } from './scores.service';
import { Score } from '@prisma/client';
import { Response } from 'express';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  // Create a new score
  @Post()
  async createScore(
    @Body() body: { score: number; percentage: number; userId: number; examId?: number; assessmentType?: 'add' | 'manual' },
  ): Promise<Score> {
    const { score, percentage, userId, examId, assessmentType } = body;
    return this.scoresService.createScore(score, percentage, userId, examId, assessmentType);
  }

  // Get all scores
  @Get()
  async getAllScores(): Promise<Score[]> {
    return this.scoresService.getAllScores();
  }

  // Get scores by userId (for a specific student)
  @Get('user/:userId')
  async getScoresByUserId(
    @Param('userId', ParseIntPipe) userId: number, // Ensures userId is parsed as a number
  ): Promise<Score[]> {
    return this.scoresService.getScoresByUserId(userId);
  }

//Get all scores for a specific assessment using assessment id
@Get('/:Id')
async getScoresByAssessmentId(
  @Param('Id') Id: string
): Promise<Score[]> {
  const assessmentId = parseInt(Id, 10);
  return this.scoresService.getScoresByAssessmentId(assessmentId);
}


@Patch(':id/publishResults')
    async publishExamResults(@Param('id') id: string, @Res() res: Response) {
      try {
        const publishedExamResults = await this.scoresService.publishExamResults(parseInt(id));
        return res.json(publishedExamResults);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }

  // Update an existing score
  @Put(':scoreId')
  async updateScore(
    @Param('scoreId') scoreId: number,
    @Body() body: { score: number; percentage: number; examId?: number },
  ): Promise<Score> {
    const { score, percentage, examId } = body;
    return this.scoresService.updateScore(scoreId, score, percentage, examId);
  }

  // Delete a score
  @Delete(':scoreId')
  async deleteScore(@Param('scoreId') scoreId: number): Promise<Score> {
    return this.scoresService.deleteScore(scoreId);
  }
}

