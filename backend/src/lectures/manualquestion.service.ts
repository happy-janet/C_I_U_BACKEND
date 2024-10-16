import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Adjust the import based on your project structure
import { CreateQuestionManualDto, UpdateQuestionManualDto } from '../lectures/dto/manual-questions.dto';
// import { QuestionManual } from '@prisma/client'


@Injectable()
export class ManualQuestionService {
  constructor(private readonly prisma: PrismaService) {}

  async addQuestionToAssessment(assessmentId: number, createQuestionDto: CreateQuestionManualDto) {
    const {questions, options, correctAnswer} = createQuestionDto;
    
    return this.prisma.questionManual.create({
      data: {
        assessment: { connect: { id: assessmentId, } },
        questions,
        options,
        correctAnswer,
      },
    });
  }

  async getQuestion(id: number) {
    return this.prisma.questionManual.findUnique({ where: { id } });
  }

  async updateQuestion(questionId: number, updateQuestionDto: UpdateQuestionManualDto ) {
    const { questions, options, correctAnswer } = updateQuestionDto;
    return this.prisma.questionManual.update({
      where: { id: questionId },
      data: {
        questions,
        options,
        correctAnswer,
      },
    });
  }

  async deleteQuestion(questionId: number) {
    return this.prisma.questionManual.delete({
      where: { id: questionId },
    });
  }
}