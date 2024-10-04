import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LecturesModule } from './lectures/lectures.module';
import { ConfigModule } from '@nestjs/config';
import { StudentsModule } from './students/students.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './lectures/auth.module'; 
import { PrismaModule } from '../prisma/prisma.module'; 

@Module({
  imports: [
    LecturesModule,
    StudentsModule,
    AuthModule,
    AdminModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config globally available
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
