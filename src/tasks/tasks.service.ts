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
    const task = await this.prisma.task.create({
      data: {
        cityId: data.cityId,
        cityArea: data.cityArea,
        categoryId: data.categoryId,
        executeAt: data.executeAt ? new Date(data.executeAt) : null,
        description: data.description,
        priceMin: data.priceMin,
        priceMax: data.priceMax,
        commission: data.commission,
        phone: data.phone,
        address: data.address,
        statusId: data.statusId,
        creatorUserId: data.creatorUserId,
        performerUserId: data.performerUserId ?? null,
        emergencyCall: data.emergencyCall ?? false,
      },
    });

    return { success: 'Задание успешно добавлено!', task: task };
  }

  /** Получение всех задач */
  async findAll(query: {
    cityId?: number;
    categoryId?: number;
    statusId?: number;
    performerUserId?: number;
    executeAtFrom?: string;
    executeAtTo?: string;
    emergencyCall?: boolean;
  }) {
    const tasks = await this.prisma.task.findMany({
      where: {
        cityId: query.cityId,
        categoryId: query.categoryId,
        statusId: query.statusId,
        performerUserId: query.performerUserId,
        emergencyCall: query.emergencyCall,
        executeAt:
          query.executeAtFrom || query.executeAtTo
            ? {
                gte: query.executeAtFrom
                  ? new Date(query.executeAtFrom)
                  : undefined,
                lte: query.executeAtTo
                  ? new Date(query.executeAtTo)
                  : undefined,
              }
            : undefined,
      },
      include: {
        city: true,
        category: true,
        status: true,
      },
    });

    return tasks;
  }

  /** Получение всех задач */
  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        city: true,
        category: true,
        status: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Задание с ID ${id} не найдено`);
    }

    return task;
  }

  /** Обновление задачи */
  async update(id: number, updateTaskDto: UpdateTaskDto) {
    // Проверяем, существует ли задача
    const existingTask = await this.prisma.task.findUnique({ where: { id } });

    if (!existingTask) {
      throw new NotFoundException(`Задание с ID ${id} не найдено`);
    }

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: {
        cityArea: updateTaskDto.cityArea,
        executeAt: updateTaskDto.executeAt
          ? new Date(updateTaskDto.executeAt)
          : undefined,
        description: updateTaskDto.description,
        priceMin: updateTaskDto.priceMin,
        priceMax: updateTaskDto.priceMax,
        commission: updateTaskDto.commission,
        phone: updateTaskDto.phone,
        address: updateTaskDto.address,
        statusId: updateTaskDto.statusId,
        performerUserId: updateTaskDto.performerUserId ?? null,
        emergencyCall: updateTaskDto.emergencyCall ?? false,
      },
    });

    return { success: `Задание #${id} обновлено`, task: updatedTask };
  }

  /** Удаление задачи */
  async remove(id: number) {
    // Проверяем, существует ли задача
    const existingTask = await this.prisma.task.findUnique({ where: { id } });

    if (!existingTask) {
      throw new NotFoundException(`Задание с ID ${id} не найдено`);
    }

    await this.prisma.task.delete({ where: { id } });

    return { success: `Задание #${id} удалено` };
  }
}
