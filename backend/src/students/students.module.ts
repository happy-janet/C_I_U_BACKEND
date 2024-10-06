import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy'; // If you're using a custom strategy
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Ensure .env is correctly set
      signOptions: { expiresIn: '1h' }, // Increase token expiration to 1 hour or more if necessary
    }),
  ],
  controllers: [StudentsController],
  providers: [AuthService, PrismaService, JwtStrategy, StudentsService], // Providers include both AuthService and StudentsService
})
export class StudentsModule {}
