import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service'; // Correct path for AuthService
import { AuthController } from './auth.controller'; // Import AuthController
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../../prisma/prisma.service'; 
import { DashboardController } from './studentsdashboard.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' }, 
    }),
  ],
  providers: [AuthService, JwtStrategy, PrismaService],
  controllers: [AuthController], 
  exports: [AuthService,DashboardController], 
})
export class AuthModule {}
