
import { IsOptional, IsString } from 'class-validator';

export class DeleteUserDto {
  @IsOptional()
  @IsString()
  first_name : string;
  
  @IsOptional()
  @IsString()
  last_name : string

  @IsOptional()
  @IsString()
  program?: string;

  @IsOptional()
  @IsString()
  registrationNo?: string;
}
