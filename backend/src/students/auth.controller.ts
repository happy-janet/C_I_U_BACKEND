import { Controller, Post, Body, UnauthorizedException,UseGuards, Request  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; // Import the LoginDto
import { JwtAuthGuard } from './jwt-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // Validate student with LoginDto (containing both registrationNo and password)
    const student = await this.authService.validateStudent(loginDto);
    if (!student) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Login method returns the JWT token
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    // Instruct client to handle token removal
    return this.authService.logout();
  }
}

