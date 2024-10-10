import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamPaper } from './exam-paper.entity';
import { Question } from './question.entity';
import { ExamPaperController } from './exam-paper.controller';
import { ExamPaperService } from './exam-paper.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExamPaper, Question])],
  controllers: [ExamPaperController],
  providers: [ExamPaperService],
})
export class ExamPaperModule {}
