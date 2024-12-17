import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';

export class ResumeExamDto {
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @IsInt()
  @IsNotEmpty()
  examId: number;

  @IsEnum(['in-progress', 'completed'], {
    message:
      'status must be one of the following values: in-progress or completed',
  })
  @IsNotEmpty()
  status: 'in-progress' | 'completed';
}
