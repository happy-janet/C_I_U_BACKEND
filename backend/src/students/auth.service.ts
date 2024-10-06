import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // Validate student by registration number and password
  async validateStudent(loginDto: LoginDto): Promise<any> {
    const { registrationNo, password } = loginDto;

    const student = await this.prisma.users.findUnique({
      where: { registrationNo },
    });

    // If student exists and password matches, return student info excluding the password
    if (student && await bcrypt.compare(password, student.password)) {
      const { password, ...result } = student;
      return result;
    }

    // Throw error if credentials are invalid
    throw new UnauthorizedException('Invalid credentials');
  }

  // Login method to issue JWT token
  async login(loginDto: LoginDto) {
    const student = await this.validateStudent(loginDto);

    const payload = { registrationNo: student.registrationNo, sub: student.id };
    return {
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
    };
  
  }

  async logout(): Promise<any> {
    return { message: 'Logout successful. Please remove token on client.' };
  }
}
  

