// submission.dto.ts
import { IsInt, IsNotEmpty, IsArray } from 'class-validator';

export class SubmissionDto {
  @IsInt()
  @IsNotEmpty()
  assessmentId: number;

  @IsArray()
  answers: { questionId: number; answer: string }[];
}
