import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SetPaidDto } from './dto/set-paid.dto';
import admin from 'src/firebase';
import { AdminAuthGuard } from 'src/shared/guards/admin.auth.guard';
import { UserAuthGuard } from 'src/shared/guards/user.auth.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(AdminAuthGuard)
  async create(@Body() createTaskDto: CreateTaskDto) {
    const createdTask = await this.tasksService.create(createTaskDto);

    const { city_id, description } = createTaskDto;
    const priorities = [
      { priority: 2, delay: 0 },
      { priority: 1, delay: 40000 },
      { priority: 0, delay: 80000 },
    ];

    priorities.forEach(({ priority, delay }) => {
      setTimeout(async () => {
        console.log(
          `Fetching executors for city_id: ${city_id}, priority: ${priority}`,
        );

        const executors = await this.tasksService.findExecutorsForPush(
          city_id,
          priority,
        );

        console.log(
          `Found ${executors.length} executors for priority ${priority}`,
        );

        const registrationTokens = executors
          .map((user) => user.fcm_token?.fcmToken)
          .filter((token) => typeof token === 'string' && token.trim() !== '');

        console.log('Executors:', executors);
        console.log(
          `Filtered to ${registrationTokens.length} valid registration tokens`,
        );
        console.log('registrationTokens:', registrationTokens);

        if (registrationTokens.length > 0) {
          const messages = registrationTokens.map((token) => ({
            token,
            notification: {
              title: '✅ Новая заявка',
              body: `⚙️ ${description}`,
            },
            android: {
              notification: { sound: '../../fart.mp3' },
            },
            apns: {
              payload: { aps: { sound: '../../fart.mp3' } },
            },
          }));

          admin
            .messaging()
            .sendEach(messages as any)
            .then((response) => {
              console.log(
                `${response.successCount} messages were sent successfully for priority ${priority}`,
              );

              if (response.failureCount > 0) {
                response.responses.forEach((resp, idx) => {
                  if (!resp.success) {
                    console.error(
                      `Failed to send message to token ${registrationTokens[idx]}:`,
                      resp.error,
                    );
                  }
                });
              }
            })
            .catch((error) => {
              console.error(
                `Error sending messages for priority ${priority}:`,
                error,
              );
            });
        } else {
          console.log(
            `No valid registration tokens found for priority ${priority}.`,
          );
        }
      }, delay);
    });

    return createdTask;
  }

  @Get()
  @UseGuards(UserAuthGuard)
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
          ? status_id.map(Number)
          : [Number(status_id)]
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
  @UseGuards(UserAuthGuard)
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Get('archive')
  @UseGuards(UserAuthGuard)
  async findArchivedTasks(@Query('isPaid') is_paid?: string) {
    const isPaidFilter = is_paid !== undefined ? is_paid === 'true' : undefined;
    return this.tasksService.findArchivedTasks(isPaidFilter);
  }

  @Patch('/set-paid')
  @UseGuards(AdminAuthGuard)
  setPaid(@Body() setPaidDto: SetPaidDto) {
    return this.tasksService.markTaskAsPaid(setPaidDto);
  }

  @Patch(':id')
  @UseGuards(UserAuthGuard)
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
