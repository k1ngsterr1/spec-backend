import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(
    @Query('city_id') city_id?: number,
    @Query('category_id') category_id?: number,
    @Query('status_id') status_id?: number,
    @Query('performer_user_id') performer_user_id?: number,
    @Query('executeAtFrom') executeAtFrom?: string,
    @Query('executeAtTo') executeAtTo?: string,
    @Query('emergency_call') emergency_call?: boolean,
  ) {
    return this.tasksService.findAll({
      city_id: city_id ? Number(city_id) : undefined,
      category_id: category_id ? Number(category_id) : undefined,
      status_id: status_id ? Number(status_id) : undefined,
      performer_user_id: performer_user_id
        ? Number(performer_user_id)
        : undefined,
      executeAtFrom: executeAtFrom || undefined,
      executeAtTo: executeAtTo || undefined,
      emergency_call: emergency_call || undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
