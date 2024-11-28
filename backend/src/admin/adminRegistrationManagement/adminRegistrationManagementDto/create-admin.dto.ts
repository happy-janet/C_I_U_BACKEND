import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminSignUpDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  role: string;
}
