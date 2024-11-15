// scores.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { CreateScoreDto } from './dto/create-score.dto';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  // Endpoint to add a new score
  @Post('add')
  async addScore(@Body() createScoreDto: CreateScoreDto) {
    return this.scoresService.addScore(createScoreDto);
  }

  // Endpoint to get scores by student ID
  @Get('student/:userId')
  async getScoresByStudent(@Param('userId') userId: string) {
    return this.scoresService.getScoresByStudent(parseInt(userId));
  }

  // // Endpoint to get scores by assessment ID
  // @Get('assessment/:examId')
  // async getScoresByAssessment(@Param('examId') examId: string) {
  //   return this.scoresService.getScoresByAssessment(parseInt(examId));
  // }
}
