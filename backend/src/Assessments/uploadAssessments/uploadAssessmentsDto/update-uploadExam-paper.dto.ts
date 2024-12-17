import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatemanualAssessmentDto {
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

  @IsDate()
  scheduledDate: Date;

  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;

  @IsString()
  createdBy: string;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @IsBoolean()
  @IsOptional()
  isDraft?: boolean; // Ensure this property is included

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean; // Ensure this property is included

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => QuestionManualDto) // Transform and validate each question object
  questions?: QuestionManualDto[];
  status: any;
}

export class QuestionManualDto {
  @IsString()
  @IsNotEmpty()
  questions: string;

  @IsNotEmpty()
  options: string[]; // Since your schema stores it as JSON

  @IsNotEmpty()
  correctAnswer: string; // Since your schema stores it as JSON
}
