import { Controller, Post, Body, Get, Req, Put, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
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
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('login-history')
  async getLoginHistory(@Req() req) {
    const userId = req.user.userId;
    return this.authService.getLoginHistory(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile/update-name')
  async updateName(@Req() req, @Body() updateNameDto: { firstName?: string; lastName?: string }) {
    const userId = req.user.userId;
    return this.authService.updateName(userId, updateNameDto);
  }
}
