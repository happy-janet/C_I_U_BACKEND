// src/faq/faq.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFAQDto } from './dto/create-faq.dto'; // Ensure DTO is imported
import { FAQ } from '@prisma/client';

@Injectable()
export class FAQService {
  constructor(private readonly prisma: PrismaService) {}

  // Method to create a new FAQ
  async createFAQ(createFaqDto: CreateFAQDto): Promise<FAQ> {
    const { question, answer } = createFaqDto;

    try {
      const faq = await this.prisma.fAQ.create({
        data: {
          question,
          answer,
        },
      });
      return faq;
    } catch (error) {
      console.error('Error creating FAQ:', error);
      throw new InternalServerErrorException('Could not create FAQ');
    }
  }

  // Method to get all FAQs
  async findAll() {
    try {
      console.log('Fetching all FAQs...');
      return await this.prisma.fAQ.findMany();
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw new NotFoundException('Failed to fetch FAQs');
    }
  }
}


  

