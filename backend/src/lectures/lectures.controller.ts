import { Controller, Body, Param, Patch } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { LecturesService } from './lectures.service';

@Controller('lectures')
export class LecturesController {
    constructor(private readonly lecturesService: LecturesService) {}
}
