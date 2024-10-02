import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLecturerSignUpDto } from './dto/create-lecturer.dto';

@Injectable()
export class LecturesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLecturerSignUpDto: CreateLecturerSignUpDto) {
    return this.prisma.lecturerSignUp.create({
      data: {
        first_name: createLecturerSignUpDto.first_name,
        last_name: createLecturerSignUpDto.last_name,
        email: createLecturerSignUpDto.email,
        role: createLecturerSignUpDto.role,
        password: createLecturerSignUpDto.password,
      },
    });
  }

  async findAll() {
    return this.prisma.lecturerSignUp.findMany(); // Fetch all lecturer sign-ups
  }

  async findOne(id: number) {
    return this.prisma.lecturerSignUp.findUnique({
      where: { id }, // Fetch a single lecturer sign-up by ID
    });
  }

  async delete(id: number) {
    return this.prisma.lecturerSignUp.delete({
      where: { id }, // Delete a lecturer sign-up by ID
    });
  }
}
