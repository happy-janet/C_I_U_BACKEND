import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateQuestionDto, UploadExamPaperDto } from '../lectures/dto/exam-paper.dto';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';

@Injectable()
export class ExamPaperService {
  constructor(private readonly prisma: PrismaService) {}

  // Delete exam paper method
  async deleteExamPaper(id: number) {
    const examPaper = await this.prisma.addAssessment.findUnique({ where: { id } });
    if (!examPaper) {
      throw new NotFoundException('Exam paper not found');
    }
    await this.prisma.addAssessment.delete({ where: { id } });
    return { message: 'Exam paper deleted successfully' };
  }

  // Update question within an exam paper
  async updateQuestion(id: number, questionId: number, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.prisma.question.findUnique({ where: { id: questionId } });
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return this.prisma.question.update({
      where: { id: questionId },
      data: updateQuestionDto,
    });
  }

  // Preview exam paper method
  async previewExamPaper(id: number) {
    const examPaper = await this.prisma.addAssessment.findUnique({
      where: { id },
      include: {
        questions: true, // Include associated questions
      },
    });

    if (!examPaper) {
      throw new NotFoundException('Exam paper not found');
    }

    return examPaper;
  }

  // Upload exam paper (CSV parsing)
  // Inside the ExamPaperService class
async uploadExamPaper(
  file: Express.Multer.File,
  uploadExamPaperDto: UploadExamPaperDto
) {
  // Ensure the file exists and is a CSV
  if (!file || !file.originalname.endsWith('.csv')) {
    throw new BadRequestException('CSV file not provided or incorrect file type');
  }

  // Parse and validate CSV
  const questions = await this.parseCsv(file.path);
  if (questions.length === 0) {
    throw new BadRequestException('No valid questions found in CSV');
  }

  // Convert the scheduledDate from 'YYYY-MM-DD' to Date object with only the date part
  const scheduledDate = new Date(uploadExamPaperDto.scheduledDate);
  if (isNaN(scheduledDate.getTime())) {
    throw new BadRequestException('Invalid scheduled date format. Use YYYY-MM-DD.');
  }

  // Convert startTime and endTime from 'HH:MM:SS' to a valid Date object
  const [startHour, startMinute, startSecond] = uploadExamPaperDto.startTime.split(':').map(Number);
  const [endHour, endMinute, endSecond] = uploadExamPaperDto.endTime.split(':').map(Number);

  // Create a new Date object for the start and end times with just the time component
  const startTime = new Date();
  startTime.setHours(startHour, startMinute, startSecond, 0);

  const endTime = new Date();
  endTime.setHours(endHour, endMinute, endSecond, 0);

  // Validate time format
  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    throw new BadRequestException('Invalid time format for startTime or endTime. Use HH:MM:SS.');
  }

  // Create the exam paper and associate with questions
  const examPaper = await this.prisma.addAssessment.create({
    data: {
      title: uploadExamPaperDto.title,
      description: uploadExamPaperDto.description,
      courseUnit: uploadExamPaperDto.courseUnit,
      courseUnitCode: uploadExamPaperDto.courseUnitCode,
      duration: uploadExamPaperDto.duration,
      scheduledDate, // Use the converted date
      startTime, // Use the converted start time
      endTime,   // Use the converted end time
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

  return examPaper;
}


  // New method to delete all questions in the CSV file
  async deleteAllQuestions(assessmentId: number) {
    const assessment = await this.prisma.addAssessment.findUnique({ where: { id: assessmentId } });
    
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }
  
    // Use `assessmentId` instead of `examPaperId`
    await this.prisma.question.deleteMany({ where: { assessmentId } });
    return { message: 'All questions deleted successfully' };
  }
  

  // New method to preview all questions in the CSV file
  async previewAllQuestions(assessmentId: number) {
    // Use `assessmentId` instead of `examPaperId`
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
            // Combine all option fields into a single string
            const optionFields = ['options', '_3', '_4', '_5', '_6', '_7'];
            let combinedOptions = optionFields
              .map(field => data[field])
              .filter(Boolean)
              .join('')
              .replace(/\\/g, '')
              .trim();
  
            // Ensure the combined options string is a valid JSON array
            if (!combinedOptions.startsWith('[')) {
              combinedOptions = `[${combinedOptions}`;
            }
            if (!combinedOptions.endsWith(']')) {
              combinedOptions = `${combinedOptions}]`;
            }
  
            // Parse the combined options
            const parsedOptions = JSON.parse(combinedOptions);
  
            // Add validated data to results
            results.push({
              content: data.content,
              answer: data.answer || '',
              options: parsedOptions,
            });
          } catch (error) {
            console.error('Error parsing row:', error.message, 'Row data:', data);
          }
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => reject(new BadRequestException('Error reading CSV: ' + error.message)));
    });
  }
}
