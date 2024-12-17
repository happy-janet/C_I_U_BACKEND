import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LecturesModule } from './lecturer/lecturerManagement/lecturer.module';
import { ConfigModule } from '@nestjs/config';
import { StudentsModule } from './students/studentmanagement/students.module';
import { AdminModule } from './admin/adminRegistrationManagement/admin.module';
import { ExamProgressModule } from './students/exam-progress.module';

// proctoring livestream
import { ProctorModule } from './proctoring/proctor.module';
import { ScoresModule } from './scores/scores.module';
// import { AuthModule } from './lectures/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CoursesModule } from './Courses/courses.module';
import { IssueReportController } from './reports/issue-report.controller';
import { FAQService } from './FAQ/faq.service';
import { FAQController } from './FAQ/faq.controller';
import { NotificationGateway } from './reports/issue_reportnotification.gateway';
import { IssueReportService } from './reports/issue-report.service';
import { RolesGuard } from './students/studentmanagement/roles.guard';
import { StudentAuthModule } from './students/studentauth/auth.module';
// import { AssessmentModule } from './students/assessement.module';
import { FaqModule } from './FAQ/faq.module';
import { NotificationModule } from './notifications/notification.module';
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
    ProctorModule,
    ManualExamPaperModule,
    ExamPaperModule,
    QuestionsModule,
    NotificationModule,
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
  ],
  controllers: [AppController, IssueReportController, FAQController],
  providers: [
    AppService,
    IssueReportService,
    FAQService,
    NotificationGateway,
    RolesGuard,
  ],
})
export class AppModule {}
