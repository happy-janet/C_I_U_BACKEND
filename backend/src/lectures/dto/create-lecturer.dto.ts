import { IsString, IsEmail } from 'class-validator';

export class CreateLecturerSignUpDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  role: string;

  // Removed password field since it's not part of the LecturerSignUp model
}
