import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAdminSignUpDto } from '../admin/dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../lectures/dto/update-user.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // Create admin with hashed password
  async create(createAdminSignUpDto: CreateAdminSignUpDto) {
    const hashedPassword = await bcrypt.hash(createAdminSignUpDto.password, 10);
    return this.prisma.adminSignUp.create({
      data: {
        first_name: createAdminSignUpDto.first_name,
        last_name: createAdminSignUpDto.last_name,
        email: createAdminSignUpDto.email,
        role: createAdminSignUpDto.role,
        password: hashedPassword, // Save hashed password
      },
    });
  }

  // Update admin by ID
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.adminSignUp.findUnique({ where: { id: Number(id) } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.adminSignUp.update({
      where: { id: Number(id) },
      data: updateUserDto,
    });
  }
  
  // Fetch all admins
  async findAll() {
    return this.prisma.adminSignUp.findMany();
  }

  // Fetch a single admin by ID
  async findOne(id: number) {
    return this.prisma.adminSignUp.findUnique({
      where: { id },  // This should work if 'id' is a valid number
    });
  }
  
  


  // Delete an admin by ID
  async delete(id: number) {
    return this.prisma.adminSignUp.delete({
      where: { id },
    });
  }

  async getProfile(id: number) {
    return this.prisma.adminSignUp.findUnique({
      where: { id },
      select: {
        first_name: true,
        last_name: true,
        role: true
      },
    });
  }
}