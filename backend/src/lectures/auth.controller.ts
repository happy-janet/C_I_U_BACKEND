import { Controller, Post, Body, Res, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto'; // Import the DTO
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LecturesService } from './lectures.service'; 


@Controller('lecturer_auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private lecturesService: LecturesService
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
      return this.lecturesService.login(loginDto.email, loginDto.password);
  }
  
  @Post('forgot-pass')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
      return this.authService.forgotPassword(forgotPasswordDto);
  }
  @Post('reset-pass')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    // Ensure that the token is passed correctly in the resetPasswordDto
    return this.authService.resetPassword(resetPasswordDto);
}

}
