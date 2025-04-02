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
import { CitiesService } from './cities.service';
import { UpdateCityDto } from './dto/update-city.dto';
import { CreateCityDto } from './dto/create-city.dto';
import { AdminAuthGuard } from 'src/shared/guards/admin.auth.guard';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  @UseGuards(AdminAuthGuard)
  create(@Body() data: CreateCityDto) {
    return this.citiesService.create(data);
  }

  @Get()
  findAll() {
    return this.citiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(+id);
  }
}
