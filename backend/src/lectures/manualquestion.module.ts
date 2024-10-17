import { Module } from '@nestjs/common';
import { ManualQuestionService } from './manualquestion.service';
import { ManualQuestionController } from './manualquestion.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ManualQuestionController],
  providers: [ManualQuestionService, PrismaService],
})
export class ManualQuestionModule {}
