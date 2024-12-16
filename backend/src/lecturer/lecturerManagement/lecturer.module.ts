import { Module } from '@nestjs/common';
import { LecturesService } from './lecturer.service';
import { LecturesController } from './lecturer.controller';
import { PrismaModule } from '../../../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../LecturerAuth/jwt.strategy';
import { ConfigModule } from '@nestjs/config';

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
  providers: [LecturesService, JwtStrategy],
  controllers: [LecturesController],
})
export class LecturesModule {}
