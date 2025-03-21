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
import { SetPaidDto } from './dto/set-paid.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(
    @Query('city_id') city_id?: string,
    @Query('category_id') category_id?: string,
    @Query('status_id') status_id?: any,
    @Query('performer_user_id') performer_user_id?: string,
    @Query('executeAtFrom') executeAtFrom?: string,
    @Query('executeAtTo') executeAtTo?: string,
    @Query('emergency_call') emergency_call?: string,
  ) {
    return this.tasksService.findAll({
      city_id: city_id ? Number(city_id) : undefined,
      category_id: category_id ? Number(category_id) : undefined,
      status_id: status_id
        ? Array.isArray(status_id)
          ? status_id.map(Number) // Преобразуем в массив чисел
          : [Number(status_id)] // Если один статус - делаем массив
        : undefined,
      performer_user_id: performer_user_id
        ? Number(performer_user_id)
        : undefined,
      executeAtFrom: executeAtFrom || undefined,
      executeAtTo: executeAtTo || undefined,
      emergency_call:
        emergency_call !== undefined ? emergency_call === 'true' : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Get('archive')
  async findArchivedTasks(@Query('isPaid') is_paid?: string) {
    const isPaidFilter = is_paid !== undefined ? is_paid === 'true' : undefined;
    return this.tasksService.findArchivedTasks(isPaidFilter);
  }

  @Patch('/set-paid')
  setPaid(@Body() setPaidDto: SetPaidDto) {
    return this.tasksService.markTaskAsPaid(setPaidDto);
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
