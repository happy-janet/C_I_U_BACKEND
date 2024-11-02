import { Controller, Post, Body, Res, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from '../admin/AuthService.service';
import { Response } from 'express';
import { LoginDto } from '../admin/dto/LoginDto'; // Import the DTO
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';



@Controller('adminauth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const user = await this.authService.validateUser(loginDto.email, loginDto.password);
      if (!user) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      const token = await this.authService.login(user);
      return res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
      return res.status(error.status || HttpStatus.UNAUTHORIZED).json({ message: error.message });
    }
  }
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
      return this.authService.forgotPassword(forgotPasswordDto);
  }
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    // Ensure that the token is passed correctly in the resetPasswordDto
    return this.authService.resetPassword(resetPasswordDto);
}
}



