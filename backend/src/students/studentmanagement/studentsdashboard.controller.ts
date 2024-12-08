import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../studentauth/jwt-auth.guard';

@Controller('dashboard')
export class DashboardController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getDashboard(@Request() req) {
    return {
      message: 'Welcome to the Dashboard',
      user: req.user, 
    };
  }
}
