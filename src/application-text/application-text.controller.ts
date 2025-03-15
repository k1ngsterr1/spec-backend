import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApplicationTextService } from './application-text.service';
import { CreateApplicationTextDto } from './dto/create-application-text.dto';

@Controller('application-text')
export class ApplicationTextController {
  constructor(
    private readonly applicationTextService: ApplicationTextService,
  ) {}

  @Post()
  create(@Body() createApplicationTextDto: CreateApplicationTextDto) {
    return this.applicationTextService.create(createApplicationTextDto);
  }

  @Get()
  findOne() {
    return this.applicationTextService.findOne();
  }
}
