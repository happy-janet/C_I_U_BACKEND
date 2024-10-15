import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LecturesModule } from './lectures/lectures.module';
import { ConfigModule } from '@nestjs/config';
import { StudentsModule } from './students/students.module';
import { AdminModule } from './admin/admin.module';
// import { AuthModule } from './lectures/auth.module'; 
import { PrismaModule } from '../prisma/prisma.module';
import { CoursesModule } from './lectures/courses.module'; 
import { IssueReportController } from './students/issue-reprt.controller'; 
import { FAQService } from './students/faq.service';
import { FAQController } from './students/faq.controller';
import { NotificationGateway } from './students/notification.gateway';
import { IssueReportService } from './students/issue-report.service';
import { RolesGuard } from './students/roles.guard';
import { AuthModule } from './students/auth.module';



@Module({
  imports: [
    LecturesModule,
    StudentsModule,
    AuthModule,
    AdminModule,
    PrismaModule,
    CoursesModule, // <-- Add the CoursesModule here
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config globally available
    }),
  ],
  controllers: [AppController,IssueReportController, FAQController],
  providers: [AppService,IssueReportService, FAQService, NotificationGateway,RolesGuard],
})
export class AppModule {}
