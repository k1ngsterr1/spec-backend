import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /** Создание новой задачи */
  async create(data: CreateTaskDto) {
    const task = await this.prisma.tasks.create({
      data: {
        category_id: data.category_id,
        comment: data.comment,
        title: data.title,
        execute_at: data.execute_at ? new Date(data.execute_at) : null,
        description: data.description,
        price_min: data.price_min,
        price_max: data.price_max,
        commission: data.commission,
        phone: data.phone,
        address: data.address,
        status_id: data.status_id,
        creator_user_id: data.creator_user_id,
        performer_user_id: data.performer_user_id ?? null,
        emergency_call: data.emergency_call ?? false,
      },
    });

    return { success: 'Задание успешно добавлено!', task: task };
  }

  /** Получение всех задач */
  async findAll(query: {
    city_id?: number;
    category_id?: number;
    status_id?: any;
    performer_user_id?: number;
    executeAtFrom?: string;
    executeAtTo?: string;
    emergency_call?: boolean;
  }) {
    const where: any = {};

    if (query.city_id) where.city_id = query.city_id;
    if (query.category_id) where.category_id = query.category_id;

    // Поддержка одного или нескольких статус ID
    if (query.status_id) {
      where.status_id = Array.isArray(query.status_id)
        ? { in: query.status_id.map(Number) }
        : Number(query.status_id);
    }

    if (query.performer_user_id)
      where.performer_user_id = query.performer_user_id;

    // Проверяем, передан ли emergency_call в query (true/false)
    if ('emergency_call' in query) where.emergency_call = query.emergency_call;

    if (query.executeAtFrom || query.executeAtTo) {
      where.execute_at = {
        ...(query.executeAtFrom ? { gte: new Date(query.executeAtFrom) } : {}),
        ...(query.executeAtTo ? { lte: new Date(query.executeAtTo) } : {}),
      };
    }

    console.log('WHERE:', where); // Логируем перед запросом

    const tasks = await this.prisma.tasks.findMany({ where });

    return tasks;
  }

  /** Получение всех задач */
  async findOne(id: number) {
    const task = await this.prisma.tasks.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Задание с ID ${id} не найдено`);
    }

    return task;
  }

  /** Обновление задачи */
  async update(id: number, updateTaskDto: UpdateTaskDto) {
    console.log(updateTaskDto);
    // Проверяем, существует ли задача
    const existingTask = await this.prisma.tasks.findUnique({ where: { id } });

    if (!existingTask) {
      throw new NotFoundException(`Задание с ID ${id} не найдено`);
    }

    const updatedTask = await this.prisma.tasks.update({
      where: { id },
      data: {
        city_area: updateTaskDto.city_area || undefined,
        execute_at: updateTaskDto.execute_at
          ? new Date(updateTaskDto.execute_at)
          : undefined,
        description: updateTaskDto.description,
        price_min: updateTaskDto.price_min,
        price_max: updateTaskDto.price_max,
        commission: updateTaskDto.commission,
        phone: updateTaskDto.phone,
        address: updateTaskDto.address,
        status_id: updateTaskDto.status_id,
        performer_user_id: updateTaskDto.performer_user_id ?? null,
        emergency_call: updateTaskDto.emergency_call ?? false,
      },
    });

    return { success: `Задание #${id} обновлено`, task: updatedTask };
  }

  /** Удаление задачи */
  async remove(id: number) {
    // Проверяем, существует ли задача
    const existingTask = await this.prisma.tasks.findUnique({ where: { id } });

    if (!existingTask) {
      throw new NotFoundException(`Задание с ID ${id} не найдено`);
    }

    await this.prisma.tasks.delete({ where: { id } });

    return { success: `Задание #${id} удалено` };
  }
}
