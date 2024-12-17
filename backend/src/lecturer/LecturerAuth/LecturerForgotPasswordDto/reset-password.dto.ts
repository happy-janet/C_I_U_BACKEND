// src/auth/dto/reset-password.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsNumberString,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsNumberString() // Ensure token is numeric
  token: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}
