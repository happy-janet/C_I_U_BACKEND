import { IsEmail, IsOptional, IsString, MinLength} from 'class-validator'

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsEmail()
    @IsOptional({}, { message: 'Please provide a valid email address'})
    email?: string;

    @IsString()
    role?: string;

    @IsString()
    @MinLength(8, { message: 'password must be at least 8 characters long' })
    @IsOptional()
    password?: string;
}