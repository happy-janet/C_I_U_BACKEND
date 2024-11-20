import { IsString, IsEmail } from 'class-validator';

export class CreateAdminSignUpDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  role: string;

  @IsString()
  password: string;
}
