import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../lecturer/LecturerAuth/jwt-auth.guard';

@Controller('dashboard')
export class DashboardController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getDashboard() {
    return { message: 'Welcome to the Dashboard' }; 
  }
}
<<<<<<< HEAD:backend/src/admin/admindashboard.controller.ts
// To the lecturer dashboard

=======
>>>>>>> 543247f3111897e6feadd6d23c00c30bd3202db2:backend/src/admin/adminRegistrationManagement/admindashboard.controller.ts
