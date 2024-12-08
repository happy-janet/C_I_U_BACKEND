import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LecturesModule } from './lecturer/lecturerManagement/lecturer.module';
import { ConfigModule } from '@nestjs/config';
import { StudentsModule } from './students/students.module';
import { AdminModule } from './admin/adminRegistrationManagement/admin.module';
import { ExamProgressModule } from './students/exam-progress.module';


// proctoring livestream
import { SignalingModule } from './signaling/signaling.module';


import { ScoresModule } from './students/scores.module';
// import { AuthModule } from './lectures/auth.module'; 
import { PrismaModule } from '../prisma/prisma.module';
import { CoursesModule } from './Courses/courses.module'; 
import { IssueReportController } from './students/issue-reprt.controller'; 
import { FAQService } from './students/faq.service';
import { FAQController } from './students/faq.controller';
import { NotificationGateway } from './students/notification.gateway';
import { IssueReportService } from './students/issue-report.service';
import { RolesGuard } from './students/roles.guard';
import { StudentAuthModule } from './students/auth.module';
// import { AssessmentModule } from './students/assessement.module';
import { FaqModule } from './students/faq.module';
import { NotificationModule } from './students/notification/notification.module'
import { QuestionBankModule } from './questionBank/questionbank.module';


import { AuthModule } from './lecturer/LecturerAuth/lecturerLogin.module'; 
import { AdminAuthModule } from './admin/adminAuth/Adminlogin.module';


// import { ManualAssessmentModule } from './lectures/addAssessment.module';
import { ExamPaperModule } from './Assessments/uploadAssessments/uploadExam-paper.module';
import { ManualExamPaperModule } from './Assessments/manualAssessments/manual-exam-paper.module';
import { QuestionsModule } from './Assessments/Assessmentquestion/Assessmentquestion.module'; 
// import { ManualQuestionModule } from './lectures/manualquestion.module';


@Module({
  imports: [
    FaqModule, 
    LecturesModule,
    StudentsModule,
    AdminAuthModule,
    AuthModule,
    StudentAuthModule,
    AdminModule,
    PrismaModule,
    CoursesModule,
    ExamProgressModule,
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
    NotificationModule,
    
    // CoursesModule, // <-- Add the CoursesModule here

    ConfigModule.forRoot({
      isGlobal: true, // Makes the config globally available
    }),
  ],
  controllers: [AppController,IssueReportController, FAQController,],
  providers: [AppService,IssueReportService, FAQService, NotificationGateway,RolesGuard],
})
export class AppModule {}


