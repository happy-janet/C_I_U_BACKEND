import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { QuestionsService } from '../lectures/question.service';
import { CreateQuestionDto, UpdateQuestionDto } from '../lectures/dto/question.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.createQuestion(createQuestionDto);
  }

  @Get(':id')
  async getQuestion(@Param('id') id: number) {
    return this.questionsService.getQuestion(id);
  }

  @Put(':id')
  async updateQuestion(@Param('id') id: number, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionsService.updateQuestion(id, updateQuestionDto);
  }

  @Delete(':id')
  async deleteQuestion(@Param('id') id: number) {
    return this.questionsService.deleteQuestion(id);
  }
}
