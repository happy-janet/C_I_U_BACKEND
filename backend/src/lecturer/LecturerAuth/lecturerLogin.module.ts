import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DashboardController } from '../lecturerManagement/lecturerDashboard.controller'; // Adjust the import as necessary
import { AuthService } from './lecturerLogin.service';
import { AuthController } from './lecturerLogin.controller';
import { PrismaModule } from '../../../prisma/prisma.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { EmailService } from '../sendEmail';
import { LecturesService } from '../lecturerManagement/lecturer.service';
@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot(), // Ensure env variables are loaded properly
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Fetch secret from env
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, EmailService, LecturesService],
  controllers: [AuthController, DashboardController],
})
export class AuthModule {}
