// src/students/dto/create-user.dto.ts

// import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// 





// create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  registrationNo: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  courseId: number; 
}
