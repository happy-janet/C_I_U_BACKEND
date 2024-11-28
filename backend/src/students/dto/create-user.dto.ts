import { IsEmail, IsNotEmpty, IsInt } from 'class-validator';

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
  role: string;

  @IsInt() // Ensure it's an integer
  @IsNotEmpty()
  courseId: number;
}
