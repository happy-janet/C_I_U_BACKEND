import { Module } from '@nestjs/common';
import { ManualAssessmentService } from './manualquestion.service';
import { ManualAssessmentController } from './manualquestion.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ManualAssessmentController],
  providers: [ManualAssessmentService, PrismaService],
})
export class ManualQuestionModule {}
