// manual-assessment.dto.ts

import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatemanualAssessmentDto {
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  courseId: number;

  @IsString()
  @IsNotEmpty()
  courseUnit: string;

  @IsString()
  @IsNotEmpty()
  courseUnitCode: string;

  @IsInt()
  duration: number; // in minutes

  @IsDateString()
  scheduledDate: Date;

  @IsDateString()
  startTime: Date;

  @IsDateString()
  endTime: Date;

  @IsInt()
  createdBy: number;

  @IsDateString()
  createdAt?: Date;

  @IsDateString()
  updatedAt?: Date;

  questions?: QuestionManual[]; // Assuming QuestionManual is defined elsewhere
}

export class QuestionManual {
  id: number;
  questionText: string;
  options: any;
  correctAnswer: any;
  // other fields as necessary
}
