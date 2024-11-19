import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DashboardController } from '../adminRegistrationManagement/admindashboard.controller'; // Adjust the import as necessary
import { AuthService } from './Adminlogin.service';
import { AuthController } from './Adminlogin.controller';
import { PrismaModule } from '../../../prisma/prisma.module';
import { ConfigService, ConfigModule } from '@nestjs/config';



@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot(),
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
  controllers: [AuthController,DashboardController],
})
export class AdminAuthModule {}
