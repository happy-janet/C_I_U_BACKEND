import { IsInt, IsOptional, IsNumber, IsIn } from 'class-validator';

export class CreateScoreDto {
  @IsInt()
  score: number;

  @IsNumber()
  percentage: number;

  @IsInt()
  userId: number;

  @IsOptional()
  @IsInt()
  examId?: number; // Optional, because a score can exist without an assessment

  @IsOptional()
  @IsIn(['add', 'manual'])
  assessmentType?: 'add' | 'manual';
}
