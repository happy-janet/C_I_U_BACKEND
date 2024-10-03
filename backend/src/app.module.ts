import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LecturesModule } from './lectures/lectures.module';

import { StudentsModule } from './students/students.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [LecturesModule, StudentsModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}



