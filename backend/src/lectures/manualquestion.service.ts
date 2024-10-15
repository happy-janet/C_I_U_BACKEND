import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Adjust the import based on your project structure
import { CreateQuestionManualDto, UpdateQuestionManualDto } from '../lectures/dto/manual-questions.dto';
// import { QuestionManual } from '@prisma/client'


@Injectable()
export class ManualQuestionService {
  constructor(private readonly prisma: PrismaService) {}

  async addQuestionToAssessment(
    assessmentId: number,
    createQuestionDto: CreateQuestionManualDto
  ) {
    const question = await this.prisma.questionManual.create({
      data: {
        assessmentId,
        ...createQuestionDto,
      },
    });
    return question; // The resolved value is returned
  }

  async updateQuestion(
    questionId: number,
    updateQuestionDto: UpdateQuestionManualDto
  ) {
    const updatedQuestion = await this.prisma.questionManual.update({
      where: { id: questionId },
      data: {
        ...updateQuestionDto,
      },
    });
    return updatedQuestion; // The resolved value is returned
  }

  async deleteQuestion(questionId: number) {
    const deletedQuestion = await this.prisma.questionManual.delete({
      where: { id: questionId },
    });
    return deletedQuestion; // The resolved value is returned
  }
}