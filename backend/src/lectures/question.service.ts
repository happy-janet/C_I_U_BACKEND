import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuestionDto, UpdateQuestionDto } from '../lectures/dto/question.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createQuestion(createQuestionDto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: createQuestionDto,
    });
  }

  async getQuestion(id: number) {
    return this.prisma.question.findUnique({ where: { id } });
  }

  async updateQuestion(id: number, updateQuestionDto: UpdateQuestionDto) {
    return this.prisma.question.update({
      where: { id },
      data: updateQuestionDto,
    });
  }

  async deleteQuestion(id: number) {
    return this.prisma.question.delete({ where: { id } });
  }
}
