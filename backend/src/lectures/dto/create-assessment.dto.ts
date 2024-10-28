// src/assessments/dto/create-assessment.dto.ts
import { IsDate, IsInt, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateAssessmentDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  courseId: number; // Foreign key reference to the courses model

  @IsString()
  courseUnit: string;
  @IsString()
  courseUnitCode: string;

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
  questions: JSON; 

  @IsString()
  Options: JSON; 

  @IsString()
  correctAnswer: string; 

  @IsBoolean()
  @IsOptional() // This allows the property to be optional
  isDraft?: boolean; 
}
