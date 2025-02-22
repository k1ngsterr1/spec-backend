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
    @Query('cityId') cityId?: number,
    @Query('categoryId') categoryId?: number,
    @Query('statusId') statusId?: number,
    @Query('performerUserId') performerUserId?: number,
    @Query('executeAtFrom') executeAtFrom?: string,
    @Query('executeAtTo') executeAtTo?: string,
    @Query('emergencyCall') emergencyCall?: boolean,
  ) {
    return this.tasksService.findAll({
      cityId: cityId ? Number(cityId) : undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
      statusId: statusId ? Number(statusId) : undefined,
      performerUserId: performerUserId ? Number(performerUserId) : undefined,
      executeAtFrom: executeAtFrom || undefined,
      executeAtTo: executeAtTo || undefined,
      emergencyCall: emergencyCall === true,
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
