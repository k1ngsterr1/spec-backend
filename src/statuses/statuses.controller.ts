import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AdminAuthGuard } from 'src/shared/guards/admin.auth.guard';

@Controller('statuses')
export class StatusesController {
  constructor(private readonly statusesService: StatusesService) {}

  @Post()
  @UseGuards(AdminAuthGuard)
  create(@Body() createStatusDto: CreateStatusDto) {
    return this.statusesService.create(createStatusDto);
  }

  @Get()
  @UseGuards(AdminAuthGuard)
  findAll() {
    return this.statusesService.findAll();
  }

  @Get(':id')
  @UseGuards(AdminAuthGuard)
  findOne(@Param('id') id: string) {
    return this.statusesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  update(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto) {
    return this.statusesService.update(+id, updateStatusDto);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  remove(@Param('id') id: string) {
    return this.statusesService.remove(+id);
  }
}
