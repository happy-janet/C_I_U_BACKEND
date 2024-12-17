// src/courses/dto/create-course.dto.ts
import { IsArray, IsString } from 'class-validator';

export class UpdateCourseDto {
  @IsString()
  facultyName: string;

  @IsString()
  courseName: string;

  @IsArray()
  @IsString({ each: true }) // Ensures each element in the array is a string
  courseUnits: string[];

  @IsArray()
  @IsString({ each: true })
  courseUnitCode: string[];
}
