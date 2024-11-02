// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service'; // Correct path for AuthService
import { AuthController } from './auth.controller'; // Import AuthController
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../../prisma/prisma.service';
import { DashboardController } from './studentsdashboard.controller'; // Import DashboardController
import { RolesGuard } from './roles.guard'; // Import RolesGuard
import { Reflector } from '@nestjs/core';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_default_secret', // Use a default or environment variable
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    PrismaService,
    RolesGuard, // Add RolesGuard here
    Reflector, // Add Reflector if it's not automatically injected
  ],
  controllers: [AuthController, DashboardController],
  exports: [AuthService, JwtModule, RolesGuard], // Export RolesGuard
})
export class StudentAuthModule{}
