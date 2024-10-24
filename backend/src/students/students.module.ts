// src/students/students.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { FaqModule } from './faq.module'; // Correct import path
import { IssueReportModule } from './issue-report.module';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';


@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Ensure .env is correctly set
      signOptions: { expiresIn: '1h' }, // Adjust as needed
    }),
    FaqModule, // Import FaqModule to access FAQService
    IssueReportModule, // Import IssueReportModule to access IssueReportService
  ],
  controllers: [StudentsController, ExamController],
  providers: [
    AuthService,
    PrismaService,
    JwtStrategy,
    StudentsService,
    ExamService,
  ],
})
export class StudentsModule {}
