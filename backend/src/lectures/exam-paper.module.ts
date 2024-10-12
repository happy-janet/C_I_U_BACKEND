import { Module } from '@nestjs/common';
import { ExamPaperService } from './exam-paper.service';
import { ExamPaperController } from './exam-paper.controller';  // Import the controller
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ExamPaperService],
  controllers: [ExamPaperController], // Register the controller here
})
export class ExamPaperModule {}
