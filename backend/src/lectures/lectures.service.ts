import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLecturerSignUpDto } from './dto/create-lecturer.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class LecturesService {
  constructor(private readonly prisma: PrismaService) {}

  // Create lecturer with hashed password
  async create(createLecturerSignUpDto: CreateLecturerSignUpDto) {
    const emailPattern = /^[a-zA-Z]+@ciu\.ac\.ug$/; // Regex pattern for the email format

    if (!emailPattern.test(createLecturerSignUpDto.email)) {
      throw new BadRequestException('Email must be in the format: firstname@ciu.ac.ug');
    }

    const hashedPassword = await bcrypt.hash(createLecturerSignUpDto.password, 10);
    return this.prisma.lecturerSignUp.create({
      data: {
        first_name: createLecturerSignUpDto.first_name,
        last_name: createLecturerSignUpDto.last_name,
        email: createLecturerSignUpDto.email,
        role: createLecturerSignUpDto.role,
        password: hashedPassword, // Save hashed password
      },
    });
  }

  // Fetch all lecturers
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.lecturerSignUp.findUnique({ where: { id: Number(id) } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.lecturerSignUp.update({
      where: { id: Number(id) },
      data: updateUserDto,
    });
  }
  
  async findAll() {
    return this.prisma.lecturerSignUp.findMany();
  }

  async findOne(id: number) {
    return this.prisma.lecturerSignUp.findUnique({
      where: { id },
    });
  }

  async delete(id: number) {
    return this.prisma.lecturerSignUp.delete({
      where: { id },
    });
  } 
}
