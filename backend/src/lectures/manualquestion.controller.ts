import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, Get } from '@nestjs/common';
import { ManualQuestionService } from './manualquestion.service';
import { CreateQuestionManualDto, UpdateQuestionManualDto } from '../lectures/dto/manual-questions.dto';


@Controller('assessments')
export class ManualQuestionController {
  constructor(private readonly assessmentService: ManualQuestionService) {}

  @Post(':id/questions')
  async addQuestion(
    @Param('id', ParseIntPipe) assessmentId: number,
    @Body() createQuestionDto: CreateQuestionManualDto
  ) {
    return await this.assessmentService.addQuestionToAssessment(assessmentId, createQuestionDto);
  }

  @Get('questions/:questionId')
  async getQuestion(@Param('questionId', ParseIntPipe) id: number) {
    return this.assessmentService.getQuestion(id);
  }

  @Patch('questions/:questionId')
  async updateQuestion(
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body() updateQuestionDto: UpdateQuestionManualDto
  ) {
    return await this.assessmentService.updateQuestion(questionId, updateQuestionDto);
  }

  @Delete('questions/:questionId')
  async deleteQuestion(@Param('questionId', ParseIntPipe) questionId: number) {
    return await this.assessmentService.deleteQuestion(questionId);
  }
}
