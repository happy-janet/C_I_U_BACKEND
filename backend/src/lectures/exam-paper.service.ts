import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateQuestionDto, UploadExamPaperDto } from '../lectures/dto/exam-paper.dto';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import * as moment from 'moment';

@Injectable()
export class ExamPaperService {
  constructor(private readonly prisma: PrismaService) {}

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
    // Ensure the exam paper exists
    const examPaper = await this.prisma.addAssessment.findUnique({
      where: { id: examPaperId },
      include: { questions: true }, // Ensure related questions are included
    });

    if (!examPaper) {
      throw new NotFoundException('Exam paper not found');
    }

    // Find the specific question within the exam paper
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
    console.log(`Attempting to delete question ID ${questionId} from exam paper ID ${examPaperId}`);
    
    const examPaper = await this.prisma.addAssessment.findUnique({
      where: { id: examPaperId },
      include: { questions: true },
    });
    
    if (!examPaper) {
      console.log(`Exam paper with ID ${examPaperId} not found`);
      throw new NotFoundException('Exam paper not found');
    }
    
    console.log('Questions in exam paper:', examPaper.questions.map(q => q.id));
    
    const question = examPaper.questions.find(q => q.id === questionId);
    
    if (!question) {
      console.log(`Question with ID ${questionId} not found in exam paper ${examPaperId}`);
      throw new NotFoundException('Question not found in this exam paper');
    }
    
    console.log(`Deleting question with ID ${questionId}`);
    await this.prisma.question.delete({ where: { id: questionId } });
    return { message: 'Question deleted successfully' };
  }
  


  // Update a question in an exam paper
async updateQuestion(id: number, questionId: number, updateQuestionDto: UpdateQuestionDto) {
  console.log(`Updating Question: ID = ${questionId}, Exam Paper ID = ${id}`);
  
  const question = await this.prisma.question.findUnique({ where: { id: questionId } });

  if (!question) {
    console.log(`Question with ID ${questionId} not found.`);
    throw new NotFoundException('Question not found');
  }

  console.log(`Found Question: ${JSON.stringify(question)}`);

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

  // Upload exam paper (CSV parsing)
  async uploadExamPaper(file: Express.Multer.File, uploadExamPaperDto: UploadExamPaperDto) {
    if (!file || !file.originalname.endsWith('.csv')) {
      throw new BadRequestException('CSV file not provided or incorrect file type');
    }

    const questions = await this.parseCsv(file.path);
    if (questions.length === 0) {
      throw new BadRequestException('No valid questions found in CSV');
    }

    const scheduledDate = new Date(uploadExamPaperDto.scheduledDate);
    if (isNaN(scheduledDate.getTime())) {
      throw new BadRequestException('Invalid scheduled date format. Use YYYY-MM-DD.');
    }

    const [startHour, startMinute, startSecond] = uploadExamPaperDto.startTime.split(':').map(Number);
    const [endHour, endMinute, endSecond] = uploadExamPaperDto.endTime.split(':').map(Number);

    const startTime = new Date();
    startTime.setHours(startHour, startMinute, startSecond, 0);

    const endTime = new Date();
    endTime.setHours(endHour, endMinute, endSecond, 0);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      throw new BadRequestException('Invalid time format for startTime or endTime. Use HH:MM:SS.');
    }

    const examPaper = await this.prisma.addAssessment.create({
      data: {
        title: uploadExamPaperDto.title,
        description: uploadExamPaperDto.description,
        courseUnit: uploadExamPaperDto.courseUnit,
        courseUnitCode: uploadExamPaperDto.courseUnitCode,
        duration: uploadExamPaperDto.duration,
        scheduledDate,
        startTime,
        endTime,
        createdBy: uploadExamPaperDto.createdBy,
        course: { connect: { id: parseInt(uploadExamPaperDto.courseId, 10) } },
        questions: {
          create: questions.map((question) => ({
            content: question.content,
            answer: question.answer || '',
            options: question.options,
          })),
        },
      },
    });

    return {
      ...examPaper,
      scheduledDate: moment(examPaper.scheduledDate).format('YYYY-MM-DD HH:mm:ss'),
      startTime: moment(examPaper.startTime).format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment(examPaper.endTime).format('YYYY-MM-DD HH:mm:ss'),
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

