import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'; 
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLecturerSignUpDto } from './dto/create-lecturer.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LecturesService {
  constructor(private readonly prisma: PrismaService) {}

  // Create lecturer with token and token expiry
  async create(createLecturerSignUpDto: CreateLecturerSignUpDto) {
    const emailPattern = /^[a-zA-Z]+@ciu\.ac\.ug$/; // Regex pattern for the email format

    if (!emailPattern.test(createLecturerSignUpDto.email)) {
      throw new BadRequestException('Email must be in the format: firstname@ciu.ac.ug');
    }

    const token = uuidv4();
    const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Token valid for 7 days

    return this.prisma.lecturerSignUp.create({
      data: {
        first_name: createLecturerSignUpDto.first_name,
        last_name: createLecturerSignUpDto.last_name,
        email: createLecturerSignUpDto.email,
        role: createLecturerSignUpDto.role,
        token, // Store generated token
        tokenExpiry, // Store token expiry date
      },
    });
  }

  // Fetch all lecturers
  async findAll() {
    return this.prisma.lecturerSignUp.findMany();
  }

  // Update lecturer details
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

  // Find a single lecturer by ID
  async findOne(id: number) {
    return this.prisma.lecturerSignUp.findUnique({
      where: { id },
    });
  }

  // Delete a lecturer by ID
  async delete(id: number) {
    return this.prisma.lecturerSignUp.delete({
      where: { id },
    });
  }
}
