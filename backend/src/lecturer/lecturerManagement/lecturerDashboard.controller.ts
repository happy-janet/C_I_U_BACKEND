import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../LecturerAuth/jwt-auth.guard';

@Controller('dashboard')
export class DashboardController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getDashboard() {
    return { message: 'Welcome to the Dashboard' }; 
  }
}
// To the lecturer dashboard