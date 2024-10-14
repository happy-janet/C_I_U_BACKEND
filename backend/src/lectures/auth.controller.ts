import { Controller, Post, Body, Res, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto'; // Import the DTO

@Controller('auth')
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
}
