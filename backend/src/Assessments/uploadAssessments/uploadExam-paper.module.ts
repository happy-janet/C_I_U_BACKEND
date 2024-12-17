import { Module } from '@nestjs/common';
import { ExamPaperService } from './uploadExam-paper.service';
import { ExamPaperController } from './uploadExam-paper.controller'; // Import the controller
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ExamPaperService],
  controllers: [ExamPaperController], // Register the controller here
})
export class ExamPaperModule {}
