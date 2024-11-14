// src/scores/dto/create-score.dto.ts
import { IsInt, IsOptional, IsBoolean, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateScoreDto {
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  score: number;  // The score of the student

  @IsNumber()
  @IsNotEmpty()
  percentage: number;  // The percentage achieved by the student

  @IsInt()
  @IsNotEmpty()
  userId: number;  // The ID of the user (student)

  @IsInt()
  @IsOptional()
  examId?: number;  // The ID of the exam (either AddAssessment or ManualAssessment)

  @IsBoolean()
  isManualAssessment: boolean;  // Flag to differentiate between Manual and Add assessment
}
