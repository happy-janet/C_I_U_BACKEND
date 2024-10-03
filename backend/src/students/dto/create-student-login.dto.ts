import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStudentLoginDto {
  @IsNotEmpty()
  @IsString()
  registrationNo: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
