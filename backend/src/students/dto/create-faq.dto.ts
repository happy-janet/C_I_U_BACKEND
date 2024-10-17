// src/faq/dto/create-faq.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFAQDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}
