import { Controller, Post, Body } from '@nestjs/common';
import { ScoreService } from './scores.service';
import { CreateScoreDto } from './dto/create-score.dto';

@Controller('scores')
export class ScoreController {
  constructor(private scoreService: ScoreService) {}

  // Endpoint to submit a score
  @Post('submit')
  async createScore(@Body() createScoreDto: CreateScoreDto) {
    return this.scoreService.createScore(createScoreDto);
  }
}
