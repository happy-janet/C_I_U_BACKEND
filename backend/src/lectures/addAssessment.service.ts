import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatemanualAssessmentDto } from './dto/create-addAssessment.dto';
import { UpdatemanualAssessmentDto } from './dto/update-addAssessment.dto';

@Injectable()
export class ManualAssessmentService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(data: CreatemanualAssessmentDto) {
    const course = await this.prisma.courses.findUnique({
      where: { id: data.courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${data.courseId} not found`);
    }

    const questionsArray = Array.isArray(data.questions) ? data.questions : [];
    const questions = questionsArray.map((question) => ({
      questions: question.questions,
      options: JSON.stringify(question.options),
      correctAnswer: question.correctAnswer,
    }));

    const scheduledDate = new Date(data.scheduledDate);
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);

    return this.prisma.manualAssessment.create({
      data: {
        title: data.title,
        description: data.description,
        courseId: data.courseId,
        courseUnit: data.courseUnit,
        courseUnitCode: data.courseUnitCode,
        duration: data.duration,
        scheduledDate,
        startTime,
        endTime,
        createdBy: String(data.createdBy),
        status: data.status || 'Pending', // Add default status if not provided
        questions: { create: questions },
      },
    });
  }

  // FIND ALL (Assessments with Questions)
  async findAllWithQuestions() {
    return this.prisma.manualAssessment.findMany({
      include: { questions: true },
    });
  }

  // FIND ALL (Assessments without Questions)
  async findAllAssessmentsOnly() {
    return this.prisma.manualAssessment.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        courseId: true,
        courseUnit: true,
        courseUnitCode: true,
        duration: true,
        scheduledDate: true,
        startTime: true,
        endTime: true,
        createdBy: true,
        status: true, // Include status field
        createdAt: true,
        updatedAt: true,
        questions: false, // Exclude questions field
      },
    });
  }

  // FIND ALL (Questions Only)
  async findAllQuestionsOnly() {
    return this.prisma.questionManual.findMany({
      select: {
        id: true,
        questions: true,
        options: true,
        correctAnswer: true,
        assessmentId: true,
      },
    });
  }

  // FIND ONE BY ID (Assessment with Questions)
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
      questions: question.questions,
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
        status: data.status || assessment.status, // Update status field
        questions: {
          create: questions,
        },
      },
    });
  }

  // FIND UPCOMING EXAMS
  async findUpcomingExams(studentId: number) {
    const currentDate = new Date();
    return this.prisma.manualAssessment.findMany({
      where: {
        scheduledDate: { gte: currentDate },
        course: { students: { some: { id: studentId } } },
      },
      select: {
        title: true,
        scheduledDate: true,
        startTime: true,
        endTime: true,
        course: { select: { courseName: true } },
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
