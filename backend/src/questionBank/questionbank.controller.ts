import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { QuestionBankService } from './questionbank.service';

@Controller('question-bank')
export class QuestionBankController {
  constructor(private readonly questionBankService: QuestionBankService) {}

  @Get('published-assessments')
  async getPublishedAssessments() {
    try {
      return await this.questionBankService.getPublishedAssessments();
    } catch (error) {
      console.error('Error fetching published assessments:', error);
      throw new InternalServerErrorException(
        'Failed to fetch published assessments',
      );
    }
  }

  @Get(':bankId/questions')
  async getQuestionsByBankId(@Param('bankId', ParseIntPipe) bankId: number) {
    try {
      const questions =
        await this.questionBankService.getQuestionsByBankId(bankId);
      return questions;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching questions:', error);
      throw new InternalServerErrorException('Failed to fetch questions');
    }
  }

  @Get()
  async getQuestionBanks() {
    try {
      return await this.questionBankService.getQuestionBanks();
    } catch (error) {
      console.error('Error fetching question banks:', error);
      throw new InternalServerErrorException('Failed to fetch question banks');
    }
  }

  @Post(':bankId/questions')
  async addAssessmentToQuestionBank(
    @Param('bankId', ParseIntPipe) bankId: number,
    @Body('assessmentId', ParseIntPipe) assessmentId: number,
  ) {
    try {
      const createdQuestionBank =
        await this.questionBankService.createQuestionBank(assessmentId);
      return createdQuestionBank; // You might want to return the newly created resource
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Error adding assessment to question bank:', error);
      throw new InternalServerErrorException(
        'Failed to add assessment to question bank',
      );
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createQuestionBank(
    @Body('assessmentId', ParseIntPipe) assessmentId: number,
  ) {
    try {
      return await this.questionBankService.createQuestionBank(assessmentId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error creating question bank:', error);
      throw new InternalServerErrorException('Failed to create question bank');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuestionBank(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.questionBankService.deleteQuestionBank(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error deleting question bank:', error);
      throw new InternalServerErrorException('Failed to delete question bank');
    }
  }
}
