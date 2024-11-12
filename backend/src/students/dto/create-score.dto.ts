import { IsInt, IsNotEmpty, IsPositive, IsNumber } from 'class-validator';

export class CreateScoreDto {
  @IsInt()
  @IsNotEmpty()
  examId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  score: number;

  @IsNumber()
  @IsNotEmpty()
  percentage: number;

  @IsNotEmpty()
  isManualAssessment: boolean;
}
