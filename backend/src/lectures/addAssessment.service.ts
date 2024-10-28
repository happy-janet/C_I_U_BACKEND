import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatemanualAssessmentDto } from './dto/create-addAssessment.dto';
import { UpdatemanualAssessmentDto } from './dto/update-addAssessment.dto';

@Injectable()
export class ManualAssessmentService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(data: CreatemanualAssessmentDto) {
    // Validate that the courseId exists in the courses table
    const course = await this.prisma.courses.findUnique({
      where: { id: data.courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${data.courseId} not found`);
    }

    // Ensure `data.questions` is an array, or default to an empty array
    const questionsArray = Array.isArray(data.questions) ? data.questions : [];

    const questions = questionsArray.map((question) => ({
      questions: question.questionText, // Adjust according to your Prisma model
      options: JSON.stringify(question.options), // Ensure this matches your expected format
      correctAnswer: question.correctAnswer,
    }));

    // Parse dates and convert to ISO strings
    const scheduledDate = new Date(data.scheduledDate);
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);

    return this.prisma.manualAssessment.create({
      data: {
        title: data.title,
        description: data.description,
        course: { connect: { id: data.courseId } },
        courseUnit: data.courseUnit,
        courseUnitCode: data.courseUnitCode,
        duration: data.duration,
        scheduledDate: scheduledDate,
        startTime: startTime,
        endTime: endTime,
        createdBy: String(data.createdBy),
        questions: {
          create: questions, // Creates related questions in the QuestionManual model
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

    const questionsArray = Array.isArray(data.questions) ? data.questions : [];

    const questions = questionsArray.map((question) => ({
      questions: question.questionText,
      options: JSON.stringify(question.options),
      correctAnswer: question.correctAnswer,
    }));

    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);

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
        startTime: startTime || assessment.startTime,
        endTime: endTime || assessment.endTime,
        createdBy: data.createdBy || assessment.createdBy,
        questions: {
          create: questions,
        },
      },
    });
  }

  async findUpcomingExams(studentId: number) {
    const currentDate = new Date();
    
    return this.prisma.manualAssessment.findMany({
      where: {
        scheduledDate: { gte: currentDate },
        course: {
          students: { some: { id: studentId } },
        },
      },
      select: {
        title: true,
        scheduledDate: true,
        startTime: true,
        endTime: true,
        course: {
          select: { courseName: true },
        },
      },
      orderBy: { scheduledDate: 'asc' },
    });
  }

  // DELETE
  async remove(id: number) {
    return this.prisma.manualAssessment.delete({
      where: { id },
    });
  }
}
