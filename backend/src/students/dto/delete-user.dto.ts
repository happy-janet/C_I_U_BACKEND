
import { IsOptional, IsString } from 'class-validator';

export class DeleteUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  program?: string;

  @IsOptional()
  @IsString()
  registrationNo?: string;
}
