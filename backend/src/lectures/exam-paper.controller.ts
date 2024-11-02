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
import { Response } from 'express';
import { Patch, Res } from '@nestjs/common';

@Controller('exam-paper')
export class ExamPaperController {
  constructor(private readonly examPaperService: ExamPaperService) {}


  @Get('/courses')
  async getCourses() {
    return this.examPaperService.getCourses();
  }

  @Get('/courses/:courseId/units')
  async getCourseUnits(@Param('courseId') courseId: string) {
    return this.examPaperService.getCourseUnits(parseInt(courseId));
  }


  @Patch(':id/publish')
  async publishExamPaper(@Param('id') id: string, @Res() res: Response) {
    try {
      const publishedExamPaper = await this.examPaperService.publishExamPaper(parseInt(id));
      return res.json(publishedExamPaper);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

   // New route to get all exam papers
   @Get()
   async getAllExamPapers() {
     return this.examPaperService.getAllExamPapers(); // Call the service method
   }
  

   @Get('count')
   async countAllExamPapers(): Promise<{
       coursesCount: number;
       studentsCount: number;
       upcomingExamsCount: number;
   }> {
       return this.examPaperService.countAllExamPapers();
   }

   // Retrieve a specific question by questionId from a specific exam paper
  @Get(':id/question/:questionId')
  async getQuestionById(
    @Param('id') id: string,
    @Param('questionId') questionId: string,
  ) {
    const examPaperId = parseInt(id, 10);
    const parsedQuestionId = parseInt(questionId, 10);

    if (isNaN(examPaperId) || isNaN(parsedQuestionId)) {
      throw new BadRequestException('Invalid exam paper or question ID');
    }

    return this.examPaperService.getQuestionById(examPaperId, parsedQuestionId);
  }

//update each question in the exam paper
@Put(':id/question/:questionId')
async updateQuestion(
  @Param('id') id: string,
  @Param('questionId') questionId: string,
  @Body() updateQuestionDto: UpdateQuestionDto,
) {
  const examPaperId = parseInt(id, 10);
  const parsedQuestionId = parseInt(questionId, 10);
  if (isNaN(examPaperId) || isNaN(parsedQuestionId)) {
    throw new BadRequestException('Invalid exam paper or question ID');
  }
  return this.examPaperService.updateQuestion(examPaperId, parsedQuestionId, updateQuestionDto);
}

//upload exam paper
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
//get exam paper
  @Get(':id')
  async getExamPaper(@Param('id') id: string) {
    const examPaperId = parseInt(id, 10);
    if (isNaN(examPaperId)) {
      throw new BadRequestException('Invalid exam paper ID');
    }
    return this.examPaperService.previewExamPaper(examPaperId);
  }

   
//update exam paper
  @Put(':id')
  async updateExamPaper(
    @Param('id') id: string,
    @Body() updateExamPaperDto: UploadExamPaperDto,
  ) {
    const examPaperId = parseInt(id, 10);
    if (isNaN(examPaperId)) {
      throw new BadRequestException('Invalid exam paper ID');
    }
    return this.examPaperService.updateExamPaper(examPaperId, updateExamPaperDto);
  }
//delete exam papaer
  @Delete(':id')
  async deleteExamPaper(@Param('id') id: string) {
    const examPaperId = parseInt(id, 10);
    if (isNaN(examPaperId)) {
      throw new BadRequestException('Invalid exam paper ID');
    }
    return this.examPaperService.deleteExamPaper(examPaperId);
  }
//delete all questions
  @Delete(':id/questions')
  async deleteAllQuestions(@Param('id') id: string) {
    const examPaperId = parseInt(id, 10);
    if (isNaN(examPaperId)) {
      throw new BadRequestException('Invalid exam paper ID');
    }
    return this.examPaperService.deleteAllQuestions(examPaperId);
  }


// Define the DELETE route to accept both exam paper ID and question ID
@Delete(':examPaperId/question/:questionId')
async deleteQuestionById(
  @Param('examPaperId') examPaperId: string,
  @Param('questionId') questionId: string,
) {
  console.log(`Attempting to delete question with ID: ${questionId} from exam paper ID: ${examPaperId}`);
  
  const parsedQuestionId = parseInt(questionId, 10);
  const parsedExamPaperId = parseInt(examPaperId, 10);

  if (isNaN(parsedQuestionId) || isNaN(parsedExamPaperId)) {
    throw new BadRequestException('Invalid exam paper or question ID');
  }

  const result = await this.examPaperService.deleteQuestionById(parsedQuestionId, parsedExamPaperId);
  console.log(`Delete result: ${JSON.stringify(result)}`);
  return result;
}



//get all questions
  @Get(':id/questions')
  async previewAllQuestions(@Param('id') id: string) {
    const examPaperId = parseInt(id, 10);
    if (isNaN(examPaperId)) {
      throw new BadRequestException('Invalid exam paper ID');
    }
    return this.examPaperService.previewAllQuestions(examPaperId);
  }
}
