// src/faq/faq.controller.ts
import { Controller, Post, Body, Get, UseGuards,Query,Req ,Param} from '@nestjs/common'; // Import UseGuards
import { FAQService } from './faq.service';
import { CreateFAQDto } from './faqDTO/create-faq.dto';
import { JwtAuthGuard } from '../students/jwt-auth.guard'; // Correct import path
import { RolesGuard } from '../students/roles.guard'; // Correct import path
import { Roles } from '../students/role.decorator'; // Correct import path
import { FAQ } from '@prisma/client';
// import { ManualAssessmentService } from '../lectures/addAssessment.service';
@Controller('faqs')
export class FAQController {
  constructor(private readonly faqService: FAQService,
    // private readonly manualAssessmentService: ManualAssessmentService,
  ) {}

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
@Get('search')
  async searchUsers(@Query('name') name: string) {
    return this.faqService.searchUsersByName(name);
  }

  @UseGuards(JwtAuthGuard) // Ensures the user is authenticated
  @Get('profile')
  async getProfile(@Req() req) {
    const user = req.user; // user is set in request after successful authentication
    return this.faqService.getProfile(user.userId); // userId comes from decoded JWT payload
  }

}
    


