import { IsNotEmpty, IsString, IsNumberString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsNumberString() 
  token: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}
