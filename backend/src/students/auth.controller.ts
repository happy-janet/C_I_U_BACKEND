import { Controller, Post, Body, UnauthorizedException, UseGuards, Request,Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; // Import the LoginDto
import { JwtAuthGuard } from './jwt-auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const student = await this.authService.validateStudent(loginDto);
    if (!student) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Call the login method from AuthService and return its result
    return this.authService.login(loginDto); // Returns access token and success message
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    return this.authService.logout();
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
