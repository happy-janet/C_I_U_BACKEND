import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  registrationNo: string;

  @IsNotEmpty()
  password: string;
}
