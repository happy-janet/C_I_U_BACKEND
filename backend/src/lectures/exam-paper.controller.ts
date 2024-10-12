import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Get,
  Param,
  Put,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ExamPaperService } from './exam-paper.service';
import { UploadExamPaperDto, UpdateQuestionDto } from './dto/exam-paper.dto';

@Controller('exam-paper')
export class ExamPaperController {
  constructor(private readonly examPaperService: ExamPaperService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(csv)$/)) {
          return cb(new BadRequestException('Only CSV files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadExamPaper(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadExamPaperDto: UploadExamPaperDto,
  ) {
    return this.examPaperService.uploadExamPaper(file, uploadExamPaperDto);
  }

  @Get(':id')
  async getExamPaper(@Param('id') id: string) {
    const examPaperId = parseInt(id, 10); // Ensure id is a number
    if (isNaN(examPaperId)) {
      throw new BadRequestException('Invalid exam paper ID');
    }
    return this.examPaperService.previewExamPaper(examPaperId);
  }

  @Put(':id/question/:questionId')
  async updateQuestion(
    @Param('id') id: string,
    @Param('questionId') questionId: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    const examPaperId = parseInt(id, 10);
    const parsedQuestionId = parseInt(questionId, 10);
    if (isNaN(examPaperId) || isNaN(parsedQuestionId)) {
      throw new BadRequestException('Invalid IDs');
    }
    return this.examPaperService.updateQuestion(examPaperId, parsedQuestionId, updateQuestionDto);
  }

  @Delete(':id')
  async deleteExamPaper(@Param('id') id: string) {
    const examPaperId = parseInt(id, 10);
    if (isNaN(examPaperId)) {
      throw new BadRequestException('Invalid exam paper ID');
    }
    return this.examPaperService.deleteExamPaper(examPaperId);
  }

  // New method to delete all questions in the CSV file
  @Delete(':id/questions')
  async deleteAllQuestions(@Param('id') id: string) {
    const examPaperId = parseInt(id, 10);
    if (isNaN(examPaperId)) {
      throw new BadRequestException('Invalid exam paper ID');
    }
    return this.examPaperService.deleteAllQuestions(examPaperId);
  }

  // New method to preview all questions in the CSV file
  @Get(':id/questions')
  async previewAllQuestions(@Param('id') id: string) {
    const examPaperId = parseInt(id, 10);
    if (isNaN(examPaperId)) {
      throw new BadRequestException('Invalid exam paper ID');
    }
    return this.examPaperService.previewAllQuestions(examPaperId);
  }
}
