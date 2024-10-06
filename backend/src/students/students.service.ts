import { Injectable, NotFoundException, UnauthorizedException, InternalServerErrorException,BadRequestException, } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt'; 

@Injectable()
export class StudentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService 
  ) {}

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
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.prisma.users.update({
        where: { id },
        data: { password: hashedPassword }, // Store the hashed password
    });
}


  // Delete a student
  async delete(id: number) {
    await this.findOneById(id); 
    return this.prisma.users.delete({
      where: { id },
    });
  }

 

  // Create a new student
  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      return await this.prisma.users.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          program: createUserDto.program,
          registrationNo: createUserDto.registrationNo,
          password: hashedPassword,
          role: createUserDto.role,
        },
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Error creating user');
    }
  }

  // Login method
   async countStudents() {
    return this.prisma.users.count();
  }

  async countPrograms() {
    try {
      const uniquePrograms = await this.prisma.users.findMany({
        select: { program: true },
        distinct: ['program'],
      });
      return {
        count: uniquePrograms.length,
      };
    } catch (error) {
      console.error("Error counting programs:", error);
      throw new Error("Failed to count programs");
    }
  }

  async login(loginUserDto: LoginDto) {
    try {
      const { registrationNo, password } = loginUserDto;

      const user = await this.prisma.users.findUnique({
        where: { registrationNo },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { sub: user.id, registrationNo: user.registrationNo };
      const accessToken = this.jwtService.sign(payload);

      return {
        message: 'Login successful',
        access_token: accessToken,
        user: { id: user.id, registrationNo: user.registrationNo }, // Include user details if needed
      };
    } catch (error) {
      console.error('Error logging in:', error);
      throw new InternalServerErrorException('Error logging in');
    }
  }


  async searchByName(name: string) {
    try {
      // Use Prisma to find users where the name contains the search term
      return await this.prisma.users.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      });
    } catch (error) {
      console.error('Error during search:', error);
      throw new InternalServerErrorException('Error during search');
    }
  }
}





