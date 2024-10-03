import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // Method to validate user credentials
  async validateUser(email: string, password: string) {
    const user = await this.prisma.lecturerSignUp.findUnique({ where: { email } });
    
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password: _, ...result } = user; // Remove password from user data
    return result;
  }

  // Method to issue JWT
    // Method to issue JWT
    async login(user: any) {
      const payload = { email: user.email, sub: user.id }; // Payload for token
      return {
        access_token: this.jwtService.sign(payload), // Sign and return the JWT
      };
    }
  }
  