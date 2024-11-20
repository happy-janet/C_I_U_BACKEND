// question-bank.module.ts
import { Module } from '@nestjs/common';
import { QuestionBankController } from './questionbank.controller';
import { QuestionBankService } from './questionbank.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [QuestionBankController],
  providers: [QuestionBankService, PrismaService],
  exports: [QuestionBankService],
})
export class QuestionBankModule {}