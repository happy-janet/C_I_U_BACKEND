import { Module } from '@nestjs/common';
import { ExamProgressService } from './exam-progress.service';
import { ExamProgressController } from './exam-progress.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ExamProgressController],
  providers: [ExamProgressService, PrismaService],
})
export class ExamProgressModule {}
