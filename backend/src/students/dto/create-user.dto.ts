// src/students/dto/create-user.dto.ts

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  first_name: string; 

  @IsNotEmpty()
  @IsString()
  last_name: string; 

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  program: string;

  @IsNotEmpty()
  @IsString()
  registrationNo: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  role: string;
}
