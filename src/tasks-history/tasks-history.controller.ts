import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TasksHistoryService } from './tasks-history.service';
import { CreateTasksHistoryDto } from './dto/create-tasks-history.dto';
import { UpdateTasksHistoryDto } from './dto/update-tasks-history.dto';

@Controller('tasks-history')
export class TasksHistoryController {
  constructor(private readonly tasksHistoryService: TasksHistoryService) {}

  @Post()
  create(@Body() createTasksHistoryDto: CreateTasksHistoryDto) {
    return this.tasksHistoryService.create(createTasksHistoryDto);
  }

  @Get()
  findAll() {
    return this.tasksHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTasksHistoryDto: UpdateTasksHistoryDto) {
    return this.tasksHistoryService.update(+id, updateTasksHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksHistoryService.remove(+id);
  }
}
