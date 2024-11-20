import { Module } from '@nestjs/common';
import { QuestionsController } from './Assessmentquestion.controller';
import { QuestionsService } from './Assessmentquestion.service';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
