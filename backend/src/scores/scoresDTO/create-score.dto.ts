import { IsInt, IsOptional, IsNumber, IsIn, IsBoolean } from 'class-validator';

export class CreateScoreDto {
  @IsInt()
  score: number;

  @IsNumber()
  percentage: number;

  @IsInt()
  userId: number;

  @IsOptional()
  @IsInt()
  examId?: number; 


  @IsOptional()
  @IsBoolean()
  isPublished?: boolean; 

  @IsOptional()
  @IsIn(['add', 'manual'])
  assessmentType?: 'add' | 'manual';
}
