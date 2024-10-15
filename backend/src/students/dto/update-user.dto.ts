// src/students/dto/update-user.dto.ts

import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  first_name?: string; // Changed from 'String' to 'string'

  @IsOptional()
  @IsString()
  last_name?: string; // Changed from 'String' to 'string'

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  program?: string;

  @IsOptional()
  @IsString()
  registrationNo?: string;
}
