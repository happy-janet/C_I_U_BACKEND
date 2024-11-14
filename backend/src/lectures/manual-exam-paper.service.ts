import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateQuestionDto, CreateExamPaperDto } from '../lectures/dto/create-exam-paper.dto';
import * as moment from 'moment';



@Injectable()
export class ManualExamPaperService {
  constructor(private readonly prisma: PrismaService) {}



    // Fetch all available courses
async getCourses() {
  return this.prisma.courses.findMany({
    select: {
      id: true,
      courseName: true,
    },
  });
}

// Fetch course units for a selected course
async getCourseUnits(courseId: number) {
  try {
    const course = await this.prisma.courses.findUnique({
      where: { id: courseId },
      select: {
        courseUnits: true,
        courseUnitCode: true
      },
    });
    
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Transform the courseUnits array into the expected format
    const formattedUnits = course.courseUnits.map((unitName, index) => ({
      id: index + 1,
      unitName: unitName,
      unitCode: course.courseUnitCode // You might want to adjust this based on your data structure
    }));

    return {
      courseUnits: formattedUnits
    };
  } catch (error) {
    console.error('Error fetching course units:', error);
    throw error;
  }
}

  async create(data: CreateExamPaperDto) {

    const questionsArray = Array.isArray(data.questions) ? data.questions : [];
    const questions = questionsArray.map((question) => ({
      content: question.content,
      options: question.options,
      answer: question.answer,
    }));


    const scheduledDate = moment(data.scheduledDate, 'YYYY-MM-DD HH:mm:ss', true);
    if (!scheduledDate.isValid()) {
        throw new BadRequestException('Invalid scheduled date format. Use YYYY-MM-DD HH:mm:ss.');
    }

    const startTimeParts = data.startTime.split(':').map(Number);
    if (startTimeParts.length !== 3) {
      throw new BadRequestException('Invalid time format for startTime. Use HH:MM:SS.');
    }

    const startTime = moment(scheduledDate).set({ hour: startTimeParts[0], minute: startTimeParts[1], second: startTimeParts[2] });

    if (!startTime.isValid()) {
      throw new BadRequestException('Invalid time format for startTime. Use HH:MM:SS.');
    }

    const durationParts = data.duration.split(':').map(Number);
    if (durationParts.length !== 2) {
      throw new BadRequestException('Invalid duration format. Use HH:MM.');
    }
  
    const [durationHours, durationMinutes] = durationParts;
  
    // Calculate endTime based on startTime and parsed duration
    const endTime = moment(startTime)
      .add(durationHours, 'hours')
      .add(durationMinutes, 'minutes');

    return this.prisma.addAssessment.create({
      data: {
        title: data.title,
        description: data.description,
        courseId: Number (data.courseId),
        courseUnit: data.courseUnit,
        courseUnitCode: data.courseUnitCode,
        duration: data.duration,
        scheduledDate: scheduledDate.toDate(), 
        startTime: startTime.toDate(),         
        endTime: endTime.toDate(),
        createdBy: String(data.createdBy),
        questions: { create: questions },
      },
    });
  }

  // New method to get all exam papers
  async getAllExamPapers() {
    return this.prisma.manualAssessment.findMany(); // Retrieve all exam papers
  }

  // Delete exam paper method
  async deleteExamPaper(id: number) {
    const examPaper = await this.prisma.manualAssessment.findUnique({ where: { id } });

    if (!examPaper) {
      throw new NotFoundException('Exam paper not found');
    }

    // Check for related questions
    const questions = await this.prisma.questionManual.findMany({
      where: { assessmentId: id },
    });

    if (questions.length > 0) {
      throw new ConflictException('Delete all questions within and try again☠');
    }

    // Proceed to delete the exam paper
    await this.prisma.manualAssessment.delete({ where: { id } });
    return { message: 'Exam paper deleted successfully' };
  }

  // Update exam paper method
  async updateExamPaper(id: number, updateData: CreateExamPaperDto) {
    const examPaper = await this.prisma.manualAssessment.findUnique({
      where: { id },
    });

    if (!examPaper) {
      throw new NotFoundException('Exam paper not found');
    }

    return this.prisma.manualAssessment.update({
      where: { id },
      data: {
        title: updateData.title,
        description: updateData.description,
        courseUnit: updateData.courseUnit,
        courseUnitCode: updateData.courseUnitCode,
        duration: updateData.duration,
        createdBy: updateData.createdBy,
      },
    });
  }

  // Retrieve a specific question by ID
  async getQuestionById(examPaperId: number, questionId: number) {
    const examPaper = await this.prisma.manualAssessment.findUnique({
      where: { id: examPaperId },
      include: { questions: true },
    });

    if (!examPaper) {
      throw new NotFoundException('Exam paper not found');
    }

    const question = await this.prisma.questionManual.findFirst({
      where: { id: questionId, assessmentId: examPaperId },
    });

    if (!question) {
      throw new NotFoundException('Question not found in this exam paper');
    }

    return question;
  }

  // Delete specific question by ID for a given exam paper
  async deleteQuestionById(questionId: number, examPaperId: number) {
    const examPaper = await this.prisma.manualAssessment.findUnique({
      where: { id: examPaperId },
      include: { questions: true },
    });

    if (!examPaper) {
      throw new NotFoundException('Exam paper not found');
    }

    const question = examPaper.questions.find(q => q.id === questionId);

    if (!question) {
      throw new NotFoundException('Question not found in this exam paper');
    }

    await this.prisma.questionManual.delete({ where: { id: questionId } });
    return { message: 'Question deleted successfully' };
  }

  // Update a question in an exam paper
  async updateQuestion(id: number, questionId: number, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.prisma.questionManual.findUnique({ where: { id: questionId } });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return this.prisma.questionManual.update({
      where: { id: questionId },
      data: {
        content: updateQuestionDto.content,
        options: updateQuestionDto.options,
        answer: updateQuestionDto.answer || '',
      },
    });
  }

  // Preview an exam paper along with its questions
  async previewExamPaper(id: number) {
    const examPaper = await this.prisma.manualAssessment.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!examPaper) {
      throw new NotFoundException('Exam paper not found');
    }

    return examPaper;
  }


// In exam-paper.service.ts
async publishExamPaper(id: number) {
  const examPaper = await this.prisma.manualAssessment.findUnique({
    where: { id },
  });

  if (!examPaper) {
    throw new NotFoundException('Exam paper not found');
  }

  return this.prisma.manualAssessment.update({
    where: { id },
    data: { isDraft: false }, // Set isDraft to false to mark it as published
  });
}

  // Delete all questions associated with an assessment
  async deleteAllQuestions(assessmentId: number) {
    const assessment = await this.prisma.manualAssessment.findUnique({ where: { id: assessmentId } });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    await this.prisma.questionManual.deleteMany({ where: { assessmentId } });
    return { message: 'All questions deleted successfully' };
  }

  // Preview all questions associated with an assessment
  async previewAllQuestions(assessmentId: number) {
    const questions = await this.prisma.questionManual.findMany({ where: { assessmentId } });

    if (!questions || questions.length === 0) {
      throw new NotFoundException('No questions found for this assessment');
    }

    return questions;
  }

}