import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../lectures/jwt-auth.guard';

@Controller('dashboard')
export class DashboardController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getDashboard() {
    return { message: 'Welcome to the Dashboard' }; // Protected dashboard route
  }
}
// To the lecturer dashboard