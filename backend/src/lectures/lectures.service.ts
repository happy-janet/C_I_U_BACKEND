import { Injectable , NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLecturerSignUpDto } from './dto/create-lecturer.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    // Check if the user exists
    const user = await this.prisma.lecturerSignUp.findUnique({ where: { id: Number(id) } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Update the user
    return this.prisma.lecturerSignUp.update({
      where: { id: Number(id) },
      data: updateUserDto,
    });
  }
}
