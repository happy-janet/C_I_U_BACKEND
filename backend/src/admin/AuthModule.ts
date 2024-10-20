import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DashboardController } from '../admin/admindashboard.controller'; // Adjust the import as necessary
import { AuthService } from '../admin/AuthService.service';
import { AuthController } from '../admin/AuthController.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin.module'; 



@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot(),
    AdminModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController, DashboardController],
})
export class AdminAuthModule {}
