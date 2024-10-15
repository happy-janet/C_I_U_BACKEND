import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ManualQuestionService } from './manualquestion.service';
import { CreateQuestionManualDto, UpdateQuestionManualDto } from '../lectures/dto/manual-questions.dto';
// import { QuestionManual } from '@prisma/client'; // Adjust based on your Prisma setup

@Controller('assessments')
export class ManualQuestionController {
  constructor(private readonly assessmentService: ManualQuestionService) {}

  @Post(':id/questions')
  async addQuestion(
    @Param('id') assessmentId: number,
    @Body() createQuestionDto: CreateQuestionManualDto
  ) {
    return await this.assessmentService.addQuestionToAssessment(assessmentId, createQuestionDto);
  }

  @Patch('questions/:questionId')
  async updateQuestion(
    @Param('questionId') questionId: number,
    @Body() updateQuestionDto: UpdateQuestionManualDto
  ) {
    return await this.assessmentService.updateQuestion(questionId, updateQuestionDto);
  }

  @Delete('questions/:questionId')
  async deleteQuestion(@Param('questionId') questionId: number) {
    return await this.assessmentService.deleteQuestion(questionId);
  }
}
