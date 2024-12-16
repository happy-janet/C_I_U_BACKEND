import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Get,
  Delete,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { CreateAdminSignUpDto } from './adminRegistrationManagementDto/create-admin.dto';
import { AdminService } from './admin.service';
import { UpdateUserDto } from '../../lecturer/lecturerManagement/lecturerManagementDto/update-lecturer.dto';
import { JwtAuthGuard } from '../adminAuth/JwtAuthGuard';
import { SetPasswordDto } from './adminRegistrationManagementDto/set-password.dto';

@Controller('adminReg')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async register(@Body() createAdminSignUpDto: CreateAdminSignUpDto) {
    return this.adminService.registerAdmin(createAdminSignUpDto);
  }

  @Post('set-password')
  async setPassword(
    @Body() body: { token: string; password: string; confirmPassword: string },
  ): Promise<{ message: string }> {
    const { token, password, confirmPassword } = body;

    // Delegate to the service layer
    const message = await this.adminService.setPassword(
      token,
      password,
      confirmPassword,
    );

    return { message };
  }

  // Update admin by ID
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.adminService.updateUser(id, updateUserDto);
  }

  @Get()
  async findAll() {
    return this.adminService.findAll();
  }

  // Get a single admin by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const numericId = +id;

    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID: ID must be a number');
    }

    console.log('Received ID:', numericId);
    return this.adminService.findOne(numericId);
  }

  // Delete an admin by ID
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.adminService.delete(+id);
  }

  @Get('profile/:id')
  async getProfile(@Param('id') id: string) {
    return this.adminService.getProfile(+id);
  }
}
