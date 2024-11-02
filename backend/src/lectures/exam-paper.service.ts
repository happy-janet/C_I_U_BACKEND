import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateQuestionDto, UploadExamPaperDto } from '../lectures/dto/exam-paper.dto';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import * as moment from 'moment';

@Injectable()
export class ExamPaperService {
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




  // New method to get all exam papers
  async getAllExamPapers() {
    return this.prisma.addAssessment.findMany(); // Retrieve all exam papers
  }

  // Delete exam paper method
  async deleteExamPaper(id: number) {
    const examPaper = await this.prisma.addAssessment.findUnique({ where: { id } });

    if (!examPaper) {
      throw new NotFoundException('Exam paper not found');
    }

    // Check for related questions
    const questions = await this.prisma.question.findMany({
      where: { assessmentId: id },
    });

    if (questions.length > 0) {
      throw new ConflictException('Delete all questions within and try again☠️');
    }

    // Proceed to delete the exam paper
    await this.prisma.addAssessment.delete({ where: { id } });
    return { message: 'Exam paper deleted successfully' };
  }

  // Update exam paper method
  async updateExamPaper(id: number, updateData: UploadExamPaperDto) {
    const examPaper = await this.prisma.addAssessment.findUnique({
      where: { id },
    });

    if (!examPaper) {
      throw new NotFoundException('Exam paper not found');
    }

    return this.prisma.addAssessment.update({
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
    const examPaper = await this.prisma.addAssessment.findUnique({
      where: { id: examPaperId },
      include: { questions: true },
    });

    if (!examPaper) {
      throw new NotFoundException('Exam paper not found');
    }

    const question = await this.prisma.question.findFirst({
      where: { id: questionId, assessmentId: examPaperId },
    });

    if (!question) {
      throw new NotFoundException('Question not found in this exam paper');
    }

    return question;
  }

  // Delete specific question by ID for a given exam paper
  async deleteQuestionById(questionId: number, examPaperId: number) {
    const examPaper = await this.prisma.addAssessment.findUnique({
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

    await this.prisma.question.delete({ where: { id: questionId } });
    return { message: 'Question deleted successfully' };
  }

  // Update a question in an exam paper
  async updateQuestion(id: number, questionId: number, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.prisma.question.findUnique({ where: { id: questionId } });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return this.prisma.question.update({
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
    const examPaper = await this.prisma.addAssessment.findUnique({
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
  const examPaper = await this.prisma.addAssessment.findUnique({
    where: { id },
  });

  if (!examPaper) {
    throw new NotFoundException('Exam paper not found');
  }

  return this.prisma.addAssessment.update({
    where: { id },
    data: { isDraft: false }, // Set isDraft to false to mark it as published
  });
}


async countAllExamPapers() {
  const coursesCount = await this.prisma.courses.count();
  const studentsCount = await this.prisma.users.count();
  const upcomingExamsCount = await this.prisma.addAssessment.count({
    where: {  scheduledDate: { gt: new Date() } },
  });

  return {
    coursesCount,
    studentsCount,
    upcomingExamsCount,
  };
}


  // Upload exam paper (CSV parsing)
  async uploadExamPaper(file: Express.Multer.File, uploadExamPaperDto: UploadExamPaperDto) {
    if (!file || !file.originalname.endsWith('.csv')) {
      throw new BadRequestException('CSV file not provided or incorrect file type');
    }

    const questions = await this.parseCsv(file.path);
    if (questions.length === 0) {
      throw new BadRequestException('No valid questions found in CSV');
    }

    
    // Parse the scheduled date and times
    const scheduledDate = moment(uploadExamPaperDto.scheduledDate, 'YYYY-MM-DD HH:mm:ss', true);
    if (!scheduledDate.isValid()) {
        throw new BadRequestException('Invalid scheduled date format. Use YYYY-MM-DD HH:mm:ss.');
    }

    const startTimeParts = uploadExamPaperDto.startTime.split(':').map(Number);
    const endTimeParts = uploadExamPaperDto.endTime.split(':').map(Number);

    if (startTimeParts.length !== 3 || endTimeParts.length !== 3) {
      throw new BadRequestException('Invalid time format for startTime or endTime. Use HH:MM:SS.');
    }

    const startTime = moment(scheduledDate).set({ hour: startTimeParts[0], minute: startTimeParts[1], second: startTimeParts[2] });
    const endTime = moment(scheduledDate).set({ hour: endTimeParts[0], minute: endTimeParts[1], second: endTimeParts[2] });

    if (!startTime.isValid() || !endTime.isValid()) {
      throw new BadRequestException('Invalid time format for startTime or endTime. Use HH:MM:SS.');
    }

    // Prepare exam paper data
    const examPaperData = {
      title: uploadExamPaperDto.title,
      description: uploadExamPaperDto.description,
      courseUnit: uploadExamPaperDto.courseUnit,
      courseUnitCode: uploadExamPaperDto.courseUnitCode,
      duration: uploadExamPaperDto.duration,
      scheduledDate: scheduledDate.toDate(),
      startTime: startTime.toDate(),
      endTime: endTime.toDate(),
      createdBy: uploadExamPaperDto.createdBy,
      course: { connect: { id: parseInt(uploadExamPaperDto.courseId, 10) } },
      questions: {
        create: questions.map((question) => ({
          content: question.content,
          answer: question.answer || '',
          options: question.options,
        })),
      },
      isDraft: Boolean(uploadExamPaperDto.isDraft), // Ensure isDraft is a Boolean
    };

    const examPaper = await this.prisma.addAssessment.create({
      data: examPaperData,
    });

    return {
      ...examPaper,
      scheduledDate: moment(examPaper.scheduledDate).format('YYYY-MM-DD HH:mm:ss'),
      startTime: moment(examPaper.startTime).format('HH:mm:ss'),
      endTime: moment(examPaper.endTime).format('HH:mm:ss'),
    };
  }

  // Delete all questions associated with an assessment
  async deleteAllQuestions(assessmentId: number) {
    const assessment = await this.prisma.addAssessment.findUnique({ where: { id: assessmentId } });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    await this.prisma.question.deleteMany({ where: { assessmentId } });
    return { message: 'All questions deleted successfully' };
  }

  // Preview all questions associated with an assessment
  async previewAllQuestions(assessmentId: number) {
    const questions = await this.prisma.question.findMany({ where: { assessmentId } });

    if (!questions || questions.length === 0) {
      throw new NotFoundException('No questions found for this assessment');
    }

    return questions;
  }

  private async parseCsv(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => {
          try {
            const optionFields = ['options', '_3', '_4', '_5', '_6', '_7'];
            let combinedOptions = optionFields
              .map(field => data[field])
              .filter(Boolean)
              .join('')
              .replace(/\\/g, '')
              .trim();

            if (!combinedOptions.startsWith('[')) {
              combinedOptions = `[${combinedOptions}`;
            }
            if (!combinedOptions.endsWith(']')) {
              combinedOptions = `${combinedOptions}]`;
            }

            const parsedOptions = JSON.parse(combinedOptions);

            results.push({
              content: data.content,
              answer: data.answer || '',
              options: parsedOptions,
            });
          } catch (error) {
            console.error('Error parsing row:', error.message, 'Row data:', data);
          }
        })
        .on('end', () => resolve(results))
        .on('error', (error) => reject(new BadRequestException('Error reading CSV: ' + error.message)));
    });
  }
}
