import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FcmService } from './fcm.service';
import { CreateFcmDto } from './dto/create-fcm.dto';
import { UpdateFcmDto } from './dto/update-fcm.dto';

@Controller('fcm')
export class FcmController {
  constructor(private readonly fcmService: FcmService) {}

  @Post()
  async create(@Body() createFcmDto: CreateFcmDto) {
    return await this.fcmService.create(createFcmDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.fcmService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFcmDto: UpdateFcmDto) {
    return await this.fcmService.update(+id, updateFcmDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.fcmService.remove(+id);
  }
}
