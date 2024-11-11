import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class QuestionBankService {
  constructor(private readonly prisma: PrismaService) {}

  // Get published assessments
  async getPublishedAssessments() {
    return this.prisma.addAssessment.findMany({
      where: {
        isDraft: false
      },
      include: {
        course: {
          select: {
            courseName: true
          }
        }
      }
    });
  }

  // Create a new question bank or add to existing one
 async createQuestionBank(assessmentId: number) {
    const assessment = await this.prisma.addAssessment.findUnique({
      where: { id: assessmentId },
      include: { questions: true },
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment with ID ${assessmentId} not found`);
    }

    const existingBank = await this.prisma.questionBank.findFirst({
      where: {
        assessment: { courseUnit: assessment.courseUnit },
      },
    });

    if (existingBank) {
      // Add to the existing question bank
      return await this.prisma.questionBank.update({
        where: { id: existingBank.id },
        data: {
          questions: {
            connect: assessment.questions.map((question) => ({ id: question.id })),
          },
        },
        include: { assessment: true, questions: true },
      });
    } else {
      // Create a new question bank
      return await this.prisma.questionBank.create({
        data: {
          courseUnit: assessment.courseUnit,
          courseUnitCode: assessment.courseUnitCode,
          assessment: {
            connect: { id: assessmentId },
          },
          questions: {
            connect: assessment.questions.map((question) => ({ id: question.id })),
          },
        },
        include: { assessment: true, questions: true },
      });
    }
  }


  // Get all question banks
  async getQuestionBanks() {
    const questionBanks = await this.prisma.questionBank.findMany({
      include: {
        assessment: {
          include: {
            course: {
              select: {
                courseName: true
              }
            }
          }
        },
        questions: true
      }
    });

    return questionBanks.map(qb => ({
      id: qb.id,
      title: `${qb.courseUnit} Question Bank`,
      courseUnit: qb.courseUnit,
      courseUnitCode: qb.courseUnitCode,
      courseName: qb.assessment.course.courseName,
      questionCount: qb.questions.length,
      createdBy: qb.assessment.createdBy,
      createdAt: qb.createdAt
    }));
  }

  // Add questions to an existing question bank
  async addAssessmentToQuestionBank(bankId: number | string, assessmentId: number | string) {
    const parsedBankId = Number(bankId);
    const parsedAssessmentId = Number(assessmentId);
    
    if (isNaN(parsedBankId) || isNaN(parsedAssessmentId)) {
      throw new BadRequestException('Invalid bank ID or assessment ID format');
    }

    // Get the question bank and its course unit
    const questionBank = await this.prisma.questionBank.findUnique({
      where: { id: parsedBankId },
      include: {
        questions: true
      }
    });

    if (!questionBank) {
      throw new NotFoundException(`Question bank with ID ${parsedBankId} not found`);
    }

    // Get the assessment and its questions
    const assessment = await this.prisma.addAssessment.findUnique({
      where: { id: parsedAssessmentId },
      include: {
        questions: true
      }
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment with ID ${parsedAssessmentId} not found`);
    }

    // Verify course unit matches
    if (assessment.courseUnit !== questionBank.courseUnit) {
      throw new BadRequestException('Cannot add assessment from different course unit to this question bank');
    }

    try {
      // Add questions from the assessment to the question bank
      return await this.prisma.questionBank.update({
        where: { id: parsedBankId },
        data: {
          questions: {
            connect: assessment.questions.map(q => ({ id: q.id }))
          }
        },
        include: {
          assessment: {
            select: {
              title: true,
              courseUnit: true
            }
          },
          questions: true
        }
      });
    } catch (error) {
      throw new BadRequestException('Failed to add assessment questions to question bank');
    }
  }

  // Fetch questions for a specific question bank
  async getQuestionsByBankId(bankId: number) {
    const questionBank = await this.prisma.questionBank.findUnique({
      where: { id: Number(bankId) },
      include: {
        questions: true
      }
    });

    if (!questionBank) {
      throw new NotFoundException(`Question bank with ID ${bankId} not found`);
    }

    return questionBank.questions;
  }

  // Delete a question bank
  async deleteQuestionBank(id: number) {
    const questionBank = await this.prisma.questionBank.findUnique({
      where: { id }
    });

    if (!questionBank) {
      throw new NotFoundException('Question bank not found');
    }

    return this.prisma.questionBank.delete({
      where: { id }
    });
  }
}