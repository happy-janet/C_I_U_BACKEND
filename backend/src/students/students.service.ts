import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  // Get all students
  async findAll() {
    return this.prisma.users.findMany();
  }

  // Get a student by ID
  async findOneById(id: number) {
    const student = await this.prisma.users.findUnique({
      where: { id },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  // Create a new student
  async create(createUserDto: CreateUserDto) {
    return this.prisma.users.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        program: createUserDto.program,
        registrationNo: createUserDto.registrationNo,
        password: createUserDto.password,
        role: createUserDto.role,
      },
    });
  }

  // Update student details
  async update(id: number, updateUserDto: CreateUserDto) {
    // First, find the student by ID to ensure they exist
    const existingStudent = await this.findOneById(id);
    if (!existingStudent) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
  
    // If the email is being updated, check if it's already used by another student
    if (updateUserDto.email) {
      const studentWithEmail = await this.prisma.users.findUnique({
        where: { email: updateUserDto.email },
      });
  
      // Check if the found student with that email is not the same as the one being updated
      if (studentWithEmail && studentWithEmail.id !== id) {
        throw new Error('Email is already in use by another student.');
      }
    }
  
    // Proceed with the update after validation
    return this.prisma.users.update({
      where: { id },
      data: updateUserDto,
    });
  }
  

  // Reset student password
  async resetPassword(id: number, newPassword: string) {
    const student = await this.findOneById(id);
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return this.prisma.users.update({
      where: { id },
      data: { password: newPassword },
    });
  }

  // Delete a student
  async delete(id: number) {
    await this.findOneById(id); 
    return this.prisma.users.delete({
      where: { id },
    });
  }
}
