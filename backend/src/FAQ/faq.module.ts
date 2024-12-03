// src/faq/faq.module.ts
import { Module } from '@nestjs/common';
import { FAQService } from './faq.service';
import { FAQController } from './faq.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { StudentAuthModule } from '../students/auth.module'; 
// Ensure this path is correct
// import { ManualAssessmentService } from '../lectures/addAssessment.service';

@Module({
  imports: [PrismaModule, StudentAuthModule], // Include necessary modules
  providers: [FAQService], //ManualAssessmentService],
  controllers: [FAQController],
  exports: [FAQService],
})
export class FaqModule {}
