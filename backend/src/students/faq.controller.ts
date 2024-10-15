// src/faq/faq.controller.ts
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common'; // Import UseGuards
import { FAQService } from './faq.service';
import { CreateFAQDto } from './dto/create-faq.dto';
import { JwtAuthGuard } from './jwt-auth.guard'; // Correct import path
import { RolesGuard } from './roles.guard'; // Correct import path
import { Roles } from './role.decorator'; // Correct import path
import { FAQ } from '@prisma/client';

@Controller('faqs')
export class FAQController {
  constructor(private readonly faqService: FAQService) {}

  // Admin creates a new FAQ@UseGuards(JwtAuthGuard, RolesGuard) // Now UseGuards is recognized
  // @Roles('admin')
  @Post('create')
  async createFAQ(@Body() createFaqDto: CreateFAQDto): Promise<FAQ> {
    return this.faqService.createFAQ(createFaqDto); // Fixed in step 2
  }

  // Students access all FAQs
  @Get('')
async getAllFaqs() {
  console.log('Received request to get all FAQs');
  return this.faqService.findAll();
}
}

