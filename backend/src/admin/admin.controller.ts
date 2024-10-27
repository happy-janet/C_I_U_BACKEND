import { Controller, Post, Body, Patch, Param, UseGuards,Get, Delete,Req ,BadRequestException
} from '@nestjs/common';
import { CreateAdminSignUpDto } from '../admin/dto/create-admin.dto';
import { AdminService } from './admin.service'; 
import { UpdateUserDto } from '../lectures/dto/update-user.dto';
import { JwtAuthGuard } from './JwtAuthGuard';
@Controller('adminReg')
export class AdminController {
  constructor(private readonly adminService: AdminService) {} 

  @Post()
  async create(@Body() createAdminSignUpDto: CreateAdminSignUpDto) {
    return await this.adminService.create(createAdminSignUpDto); 
  }

  // Update admin by ID
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
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

  console.log('Received ID:', numericId); // Log the ID for debugging
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