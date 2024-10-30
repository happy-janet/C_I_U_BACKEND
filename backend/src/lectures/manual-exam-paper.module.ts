import { Module } from '@nestjs/common';
import { ManualExamPaperService } from './manual-exam-paper.service';
import { ManualExamPaperController } from './manual-exam-paper.controller';  // Import the controller
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ManualExamPaperService],
  controllers: [ManualExamPaperController], // Register the controller here
})
export class ManualExamPaperModule {}
