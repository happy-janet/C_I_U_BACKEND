// dto/create-question-bank.dto.ts
import { IsNumber, IsInt, IsPositive } from 'class-validator';

export class CreateQuestionBankDto {
  @IsNumber()
  @IsInt()
  @IsPositive()
  assessmentId: number;
}
