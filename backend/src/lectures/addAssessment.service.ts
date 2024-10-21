import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatemanualAssessmentDto } from './dto/create-addAssessment.dto';
import { UpdatemanualAssessmentDto } from './dto/update-addAssessment.dto';

@Injectable()
export class ManualAssessmentService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(data: CreatemanualAssessmentDto) {
    const questions = data.questions?.map((question) => ({
      questions: question.questionText, // Ensure this matches the model
      options: JSON.stringify(question.options), // Ensure this matches your expected format
      correctAnswer: question.correctAnswer,
    })) || []; // Fallback to an empty array if questions is undefined

    return this.prisma.manualAssessment.create({
      data: {
        title: data.title,
        description: data.description,
        courseId: data.courseId,
        courseUnit: data.courseUnit,
        courseUnitCode: data.courseUnitCode,
        duration: data.duration,
        scheduledDate: data.scheduledDate,
        startTime: data.startTime,
        endTime: data.endTime,
        createdBy: data.createdBy,
        questions: {
          create: questions,
        },
      },
    });
  }

  // FIND ALL
  async findAll() {
    return this.prisma.manualAssessment.findMany({
      include: { questions: true },
    });
  }

  // FIND ONE BY ID
  async findOne(id: number) {
    const assessment = await this.prisma.manualAssessment.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment with ID ${id} not found`);
    }

    return assessment;
  }

  // UPDATE
  async update(id: number, data: UpdatemanualAssessmentDto) {
    const assessment = await this.findOne(id);

    const questions = data.questions?.map((question) => ({
      questions: question.questionText, // Ensure it matches the schema
      options: JSON.stringify(question.options), // Ensure correct formatting
      correctAnswer: question.correctAnswer,
    })) || []; // Fallback to an empty array if questions is undefined

    return this.prisma.manualAssessment.update({
      where: { id },
      data: {
        title: data.title || assessment.title,
        description: data.description || assessment.description,
        courseId: data.courseId || assessment.courseId,
        courseUnit: data.courseUnit || assessment.courseUnit,
        courseUnitCode: data.courseUnitCode || assessment.courseUnitCode,
        duration: data.duration || assessment.duration,
        scheduledDate: data.scheduledDate || assessment.scheduledDate,
        startTime: data.startTime || assessment.startTime,
        endTime: data.endTime || assessment.endTime,
        createdBy: data.createdBy || assessment.createdBy,
        questions: {
          create: questions,
        },
      },
    });
  }

  // DELETE
  async remove(id: number) {
    return this.prisma.manualAssessment.delete({
      where: { id },
    });
  }
}
