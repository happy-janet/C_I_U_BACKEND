import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LecturesModule } from './lectures/lectures.module';
import { ConfigModule } from '@nestjs/config';
import { StudentsModule } from './students/students.module';
import { AdminModule } from './admin/admin.module';
import { ExamModule } from './students/exam.module';


// proctoring livestream
import { SignalingModule } from './signaling/signaling.module';


import { ScoresModule } from './students/scores.module';
// import { AuthModule } from './lectures/auth.module'; 
import { PrismaModule } from '../prisma/prisma.module';
import { CoursesModule } from './lectures/courses.module'; 
import { IssueReportController } from './students/issue-reprt.controller'; 
import { FAQService } from './students/faq.service';
import { FAQController } from './students/faq.controller';
import { NotificationGateway } from './students/notification.gateway';
import { IssueReportService } from './students/issue-report.service';
import { RolesGuard } from './students/roles.guard';
import { StudentAuthModule } from './students/auth.module';
// import { AssessmentModule } from './students/assessement.module';
import { QuestionBankModule } from './lectures/question-bank.module';


import { AuthModule } from './lectures/auth.module'; 
import { AdminAuthModule } from './admin/AuthModule';


// import { ManualAssessmentModule } from './lectures/addAssessment.module';
import { ExamPaperModule } from './lectures/exam-paper.module';
import { ManualExamPaperModule } from './lectures/manual-exam-paper.module';
import { QuestionsModule } from './lectures/questions.module'; 
// import { ManualQuestionModule } from './lectures/manualquestion.module';


@Module({
  imports: [
    LecturesModule,
    StudentsModule,
    AdminAuthModule,
    AuthModule,
    StudentAuthModule,
    AdminModule,
    PrismaModule,
    CoursesModule,
    ExamModule,
    ScoresModule,
    QuestionBankModule,

    //proctoring livestream
    SignalingModule,

    // AssessmentModule,
    // ManualAssessmentModule, // <-- Add the ManualAssessmentModule here
     // <-- Add the CoursesModule here
    // ManualQuestionModule,
    ManualExamPaperModule,
    ExamPaperModule,
    QuestionsModule,
    CoursesModule, // <-- Add the CoursesModule here

    ConfigModule.forRoot({
      isGlobal: true, // Makes the config globally available
    }),
  ],
  controllers: [AppController,IssueReportController, FAQController,],
  providers: [AppService,IssueReportService, FAQService, NotificationGateway,RolesGuard],
})
export class AppModule {}


