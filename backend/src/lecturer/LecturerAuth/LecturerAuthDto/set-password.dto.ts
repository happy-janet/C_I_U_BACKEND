// src/lectures/dto/set-initial-password.dto.ts
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SetInitialPasswordDto {
  @IsNotEmpty()
  @IsString()
  setupToken: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string; // This field does not require special validation here
}
