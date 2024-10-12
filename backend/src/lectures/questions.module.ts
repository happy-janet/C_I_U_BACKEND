import { Module } from '@nestjs/common';
import { QuestionsController } from '../lectures/question.controller';
import { QuestionsService } from '../lectures/question.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
