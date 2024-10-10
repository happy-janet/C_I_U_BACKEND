import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamPaper } from './exam-paper.entity';
import { Question } from './question.entity';
import { UploadExamPaperDto, UpdateQuestionDto } from '../lectures/dto/exam-paper.dto';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';

@Injectable()
export class ExamPaperService {
  constructor(
    @InjectRepository(ExamPaper)
    private examPaperRepository: Repository<ExamPaper>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async uploadExamPaper(file: Express.Multer.File, uploadExamPaperDto: UploadExamPaperDto) {
    const questions = await this.parseCsv(file.path);

    const examPaper = this.examPaperRepository.create({
      title: uploadExamPaperDto.title,
      description: uploadExamPaperDto.description,
      questions,
    });

    return this.examPaperRepository.save(examPaper);
  }

  private parseCsv(filePath: string): Promise<Question[]> {
    return new Promise((resolve, reject) => {
      const questions: Question[] = [];
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          questions.push(this.questionRepository.create({ content: row['question'], answer: row['answer'] }));
        })
        .on('end', () => resolve(questions))
        .on('error', (err) => reject(new BadRequestException('Error parsing CSV file')));
    });
  }

  async previewExamPaper(id: number) {
    const examPaper = await this.examPaperRepository.findOne({ where: { id }, relations: ['questions'] });
    if (!examPaper) throw new NotFoundException('Exam paper not found');
    return examPaper;
  }

  async updateQuestion(id: number, questionId: number, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.questionRepository.findOne({ where: { id: questionId, examPaper: { id } } });
    if (!question) throw new NotFoundException('Question not found');

    Object.assign(question, updateQuestionDto);
    return this.questionRepository.save(question);
  }

  async deleteExamPaper(id: number) {
    const examPaper = await this.examPaperRepository.findOne({ where: { id } });
    if (!examPaper) throw new NotFoundException('Exam paper not found');

    await this.examPaperRepository.remove(examPaper);
    return { message: 'Exam paper deleted successfully' };
  }
}
