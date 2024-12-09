import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  UpdateQuestionDto,
  UploadExamPaperDto,
} from './uploadAssessmentsDto/uploadExam-paper.dto';
import { CreateQuestionDto } from '../Assessmentquestion/AssessmentquestionDto/Assessmentquestion.dto';
import * as fs from 'fs';
import csvParser from 'csv-parser';
import moment from 'moment';

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
          courseUnitCode: true,
        },
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      // Transform the courseUnits array into the expected format
      const formattedUnits = course.courseUnits.map((unitName, index) => ({
        id: index + 1,
        unitName: unitName,
        unitCode: course.courseUnitCode[index] || null, // You might want to adjust this based on your data structure
      }));

      return {
        courseUnits: formattedUnits,
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
    const examPaper = await this.prisma.addAssessment.findUnique({
      where: { id },
    });

    if (!examPaper) {
      throw new NotFoundException('Exam paper not found');
    }

    // Check for related questions
    const questions = await this.prisma.question.findMany({
      where: { assessmentId: id },
    });

    if (questions.length > 0) {
      throw new ConflictException(
        'Delete all questions within and try again☠',
      );
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

    const question = examPaper.questions.find((q) => q.id === questionId);

    if (!question) {
      throw new NotFoundException('Question not found in this exam paper');
    }

    await this.prisma.question.delete({ where: { id: questionId } });
    return { message: 'Question deleted successfully' };
  }

  // Update a question in an exam paper
  async updateQuestion(
    id: number,
    questionId: number,
    updateQuestionDto: UpdateQuestionDto,
  ) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });

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

  // Add a question in an exam paper
  async addQuestion(
    assessmentId: number,
    createQuestionDto: CreateQuestionDto,
  ) {
    const { content, options, answer, questionNumber } = createQuestionDto;

    if (!options.includes(answer)) {
      throw new Error('Answer must be one of the options.');
    }

    // Get the highest question number for the assessment
    const maxQuestion = await this.prisma.question.findFirst({
      where: { assessmentId },
      orderBy: { questionNumber: 'desc' },
      select: { questionNumber: true },
    });

    // Determine the next question number
    const nextQuestionNumber = maxQuestion ? maxQuestion.questionNumber + 1 : 1;

    return this.prisma.question.create({
      data: {
        content,
        options,
        answer,
        questionNumber: nextQuestionNumber,
        assessment: {
          connect: { id: assessmentId },
        },
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
      data: { isDraft: false },
    });
  }

  async getCompletedAssessments() {
    return this.prisma.addAssessment.findMany({
      where: {
        isDraft: false,
        endTime: {
          lte: new Date(),
        },
      },
      select: {
        id: true,
        title: true,
        courseUnit: true,
        endTime: true,
      },
    });
  }

  // async getCompletedAssessmentsByCourseUnit(courseId: number, courseUnit: string) {
  //   const currentDateTime = new Date();

  //   // Log to ensure correct values
  //   console.log('Checking courseId:', courseId, 'courseUnit:', courseUnit);

  //   // Fetch the course and validate the courseUnit exists
  //   const course = await this.prisma.courses.findUnique({
  //     where: { id: courseId },
  //     select: {
  //       courseName: true,
  //       facultyName: true,
  //       courseUnits: true,
  //     },
  //   });

  //   if (!course) {
  //     throw new Error(`Course with ID ${courseId} does not exist.`);
  //   }

  //   // Log course units available
  //   console.log('Course units available:', course.courseUnits);

  //   // Validate courseUnit
  //   if (!course.courseUnits.some(unit => unit.trim().toLowerCase() === courseUnit.trim().toLowerCase())) {
  //     throw new Error(`Course unit "${courseUnit}" does not exist for the course "${course.courseName}".`);
  //   }

  //   // Fetch all completed assessments for the course and courseUnit
  //   const completedAssessments = await this.prisma.addAssessment.findMany({
  //     where: {
  //       courseId, // Match the course ID
  //       courseUnit, // Match the specific course unit
  //       endTime: {
  //         lte: currentDateTime, // End time has passed (completed assessments)
  //       },
  //     },
  //     select: {
  //       title: true,
  //       courseUnit: true,
  //       endTime: true, // Just an additional check to make sure it's in the past
  //     },
  //   });

  //   // If no completed assessments are found, return a helpful message
  //   if (completedAssessments.length === 0) {
  //     return { message: `No completed assessments found for course unit "${courseUnit}" in course "${course.courseName}".` };
  //   }

  //   // Return the list of completed assessments
  //   return completedAssessments;
  // }

  async publishExamResults(id: number) {
    const examPaperResults = await this.prisma.addAssessment.findUnique({
      where: { id },
    });

    if (!examPaperResults) {
      throw new NotFoundException('Exam Result  not found');
    }

    return this.prisma.addAssessment.update({
      where: { id },
      data: { isPublished: true },
    });
  }

  async unpublishExamPaper(id: number) {
    const examPaper = await this.prisma.addAssessment.findUnique({
      where: { id },
    });

    if (!examPaper) {
      throw new NotFoundException('Exam paper not found');
    }

    return this.prisma.addAssessment.update({
      where: { id },
      data: { isDraft: true, status: 'unpublished' },
    });
  }

  async requestApproval(id: number) {
    const examPaper = await this.prisma.addAssessment.findUnique({
      where: { id },
    });

    if (!examPaper) {
      throw new NotFoundException('Exam paper not found');
    }

    return this.prisma.addAssessment.update({
      where: { id },
      data: { status: 'pending' },
    });
  }

  async approval(id: number) {
    const examPaper = await this.prisma.addAssessment.findUnique({
      where: { id },
    });

    if (!examPaper) {
      throw new NotFoundException('Exam paper not found');
    }

    return this.prisma.addAssessment.update({
      where: { id },
      data: { status: 'approved' },
    });
  }

  async rejection(id: number) {
    const examPaper = await this.prisma.addAssessment.findUnique({
      where: { id },
    });

    if (!examPaper) {
      throw new NotFoundException('Exam paper not found');
    }

    return this.prisma.addAssessment.update({
      where: { id },
      data: { status: 'rejected' },
    });
  }

  async countAllExamPapers() {
    const coursesCount = await this.prisma.courses.count();
    const studentsCount = await this.prisma.users.count();
    const upcomingExamsCount = await this.prisma.addAssessment.count({
      where: { scheduledDate: { gt: new Date() }, isDraft: false },
    });
    const questionBankCount = await this.prisma.questionBank.count();
    const ongoingAssessmentCount = await this.prisma.addAssessment.count({
      where: {
        isDraft: false,
        AND: [
          { scheduledDate: { lte: new Date() } },
          { endTime: { gte: new Date() } },
        ],
      },
    });

    return {
      coursesCount,
      studentsCount,
      upcomingExamsCount,
      questionBankCount,
      ongoingAssessmentCount,
    };
  }

  // Upload exam paper (CSV parsing)
  async uploadExamPaper(
    file: Express.Multer.File,
    uploadExamPaperDto: UploadExamPaperDto,
  ) {
    if (!file || !file.originalname.endsWith('.csv')) {
      throw new BadRequestException(
        'CSV file not provided or incorrect file type',
      );
    }

    const questions = await this.parseCsv(file.path);
    if (questions.length === 0) {
      throw new BadRequestException('No valid questions found in CSV');
    }

    // Parse the scheduled date and times
    const scheduledDate = moment(
      uploadExamPaperDto.scheduledDate,
      'YYYY-MM-DD HH:mm:ss',
      true,
    );
    if (!scheduledDate.isValid()) {
      throw new BadRequestException(
        'Invalid scheduled date format. Use YYYY-MM-DD HH:mm:ss.',
      );
    }

    const startTimeParts = uploadExamPaperDto.startTime.split(':').map(Number);
    if (startTimeParts.length !== 3) {
      throw new BadRequestException(
        'Invalid time format for startTime. Use HH:MM:SS.',
      );
    }

    const startTime = moment(scheduledDate).set({
      hour: startTimeParts[0],
      minute: startTimeParts[1],
      second: startTimeParts[2],
    });

    if (!startTime.isValid()) {
      throw new BadRequestException(
        'Invalid time format for startTime. Use HH:MM:SS.',
      );
    }

    const durationParts = uploadExamPaperDto.duration.split(':').map(Number);
    if (durationParts.length !== 2) {
      throw new BadRequestException('Invalid duration format. Use HH:MM.');
    }

    const [durationHours, durationMinutes] = durationParts;

    // Calculate endTime based on startTime and parsed duration
    const endTime = moment(startTime)
      .add(durationHours, 'hours')
      .add(durationMinutes, 'minutes');
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
        create: questions.map((question, index) => ({
          content: question.content,
          answer: question.answer || '',
          options: question.options,
          questionNumber: index + 1,
        })),
      },
      isDraft: Boolean(uploadExamPaperDto.isDraft), // Ensure isDraft is a Boolean
    };

    const examPaper = await this.prisma.addAssessment.create({
      data: examPaperData,
    });

    return {
      ...examPaper,
      scheduledDate: moment(examPaper.scheduledDate).format(
        'YYYY-MM-DD HH:mm:ss',
      ),
      startTime: moment(examPaper.startTime).format('HH:mm:ss'),
      endTime: moment(examPaper.endTime).format('HH:mm:ss'),
    };
  }

  // Delete all questions associated with an assessment
  async deleteAllQuestions(assessmentId: number) {
    const assessment = await this.prisma.addAssessment.findUnique({
      where: { id: assessmentId },
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    await this.prisma.question.deleteMany({ where: { assessmentId } });
    return { message: 'All questions deleted successfully' };
  }

  // Preview all questions associated with an assessment
  async previewAllQuestions(assessmentId: number) {
    const questions = await this.prisma.question.findMany({
      where: { assessmentId },
    });

    if (!questions || questions.length === 0) {
      throw new NotFoundException('No questions found for this assessment');
    }

    return questions;
  }

  async allQuestionsNoAnswer(assessmentId: number) {
    const questions = await this.prisma.question.findMany({
      where: { assessmentId },
    });

    if (!questions || questions.length === 0) {
      throw new NotFoundException('No questions found for this assessment');
    }
    const questionsWithoutAnswer = questions.map(
      ({ answer, ...questionWithoutAnswer }) => questionWithoutAnswer,
    );

    return questionsWithoutAnswer;
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
              .map((field) => data[field])
              .filter(Boolean)
              .join('')
              .replace(/\\/g, '')
              .trim();

            if (!combinedOptions.startsWith('[')) {
              combinedOptions = `[${combinedOptions}]`;
            }
            if (!combinedOptions.endsWith(']')) {
              combinedOptions = `[${combinedOptions}]`;
            }

            const parsedOptions = JSON.parse(combinedOptions);

            results.push({
              content: data.content,
              answer: data.answer || '',
              options: parsedOptions,
            });
          } catch (error: any) {
            console.error(
              'Error parsing row:',
              error.message || 'Unknown error',
              'Row data:',
              data
            );
            throw error;
          }
        })
        .on('end', () => resolve(results))
        .on('error', (error) =>
          reject(
            new BadRequestException('Error reading CSV: ' + error.message),
          ),
        );
    });
  }

  async getOngoingAssessmentsCount(): Promise<number> {
    const now = new Date();
    return this.prisma.addAssessment.count({
      where: {
        isDraft: false,
        startTime: { lte: now },
        endTime: { gte: now },
      },
    });
  }

  async getUpcomingAssessmentsCount(): Promise<number> {
    const now = new Date();
    return this.prisma.addAssessment.count({
      where: {
        isDraft: false,
        scheduledDate: { gt: now },
      },
    });
  }
}
