import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from '../../../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../adminAuth/JwtStrategy';
import { ConfigModule } from '@nestjs/config';
import { DashboardController } from './admindashboard.controller';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot(), 
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yourSecretKey', 
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AdminService, JwtStrategy],
  controllers: [AdminController, DashboardController],
  exports: [AdminService],
})
export class AdminModule {}
