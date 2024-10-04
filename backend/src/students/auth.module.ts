import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service'; // Correct path for AuthService
import { AuthController } from './auth.controller'; // Import AuthController
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../../prisma/prisma.service'; // Correct path for PrismaService

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' }, // Adjust the token expiration time as needed
    }),
  ],
  providers: [AuthService, JwtStrategy, PrismaService],
  controllers: [AuthController], // AuthController belongs here
  exports: [AuthService], // Export AuthService to be used in other modules
})
export class AuthModule {}
