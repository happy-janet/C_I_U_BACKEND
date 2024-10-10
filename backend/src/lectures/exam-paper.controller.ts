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
import * as csvParser from 'csv-parser';
import { ExamPaperService } from '../lectures/exam-paper.service';
import { UploadExamPaperDto, UpdateQuestionDto } from '../lectures/dto/exam-paper.dto';

// No need to import Multer.File separately
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
    @UploadedFile() file: Express.Multer.File, // Correctly using Express.Multer.File
    @Body() uploadExamPaperDto: UploadExamPaperDto,
  ) {
    return this.examPaperService.uploadExamPaper(file, uploadExamPaperDto);
  }

  @Get(':id')
  async previewExamPaper(@Param('id') id: number) {
    return this.examPaperService.previewExamPaper(id);
  }

  @Put(':id/question/:questionId')
  async updateQuestion(
    @Param('id') id: number,
    @Param('questionId') questionId: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.examPaperService.updateQuestion(id, questionId, updateQuestionDto);
  }

  @Delete(':id')
  async deleteExamPaper(@Param('id') id: number) {
    return this.examPaperService.deleteExamPaper(id);
  }
}
