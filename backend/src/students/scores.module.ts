import { Module } from '@nestjs/common';
import { ScoreController } from './scores.controller';
import { ScoreService } from './scores.service';
import { PrismaService } from '../../prisma/prisma.service';
@Module({
  controllers: [ScoreController],
  providers: [ScoreService, PrismaService],  // Provide the PrismaService and ScoresService
})
export class ScoresModule {}
