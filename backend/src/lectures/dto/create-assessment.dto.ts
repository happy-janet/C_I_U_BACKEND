// src/assessments/dto/create-assessment.dto.ts
import { IsDate, IsInt, IsString } from 'class-validator';

export class CreateAssessmentDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  courseId: number; // Foreign key reference to the courses model

  @IsString()
  courseUnit: string;

  @IsInt()
  duration: number; // in minutes

  @IsDate()
  scheduledDate: Date;

  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;

  @IsInt()
  createdBy: number;

  @IsString()
  questions: string; // If you need a more structured format, consider using JSON
}
