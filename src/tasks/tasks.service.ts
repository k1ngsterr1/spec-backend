import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SetPaidDto } from './dto/set-paid.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  /** Создание новой задачи */
  async create(data: CreateTaskDto) {
    const task = await this.prisma.tasks.create({
      data: {
        city_id: data.city_id,
        category_id: data.category_id,
        comment: data.comment,
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

  /** Поиск исполнителей для рассылки пуш-уведомлений */
  async findExecutorsForPush(city_id: number, priority: number) {
    const users = await this.prisma.users.findMany({
      where: { city_id, priority },
      include: {
        fcm_token: true,
      },
    });

    return users;
  }

  async findArchivedTasks(is_paid?: boolean) {
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    const tasks = await this.prisma.tasks.findMany({
      where: {
        status_id: 3, // Assuming 3 = "Completed"
        execute_at: { gte: last24Hours }, // Tasks from the last 24 hours
      },
      include: {
        balance_history: {
          select: { id: true }, // Only check if a record exists
        },
      },
      orderBy: {
        execute_at: 'desc',
      },
    });

    const tasksWithPaymentStatus = tasks.map((task) => ({
      ...task,
      is_paid: task.balance_history.length > 0, // If there are balance history records, the task is paid
    }));

    // Apply filtering based on `is_paid` query parameter
    if (is_paid !== undefined) {
      return tasksWithPaymentStatus.filter((task) => task.is_paid === is_paid);
    }

    return tasksWithPaymentStatus; // Return all if no filter is applied
  }

  async createText(data: CreateTaskDto) {
    const task = await this.prisma.tasks.create({
      data: {
        category_id: data.category_id,
        comment: data.comment,
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

    return { success: 'Текст успешно добавлен!', task: task };
  }

  async isTaskPaid(taskId: number): Promise<boolean> {
    const history = await this.prisma.balance_history.findFirst({
      where: { task_id: taskId },
    });

    return history !== null; // Если запись есть, значит оплачено
  }

  async markTaskAsPaid(data: SetPaidDto) {
    const { taskId, userId, amount, reasonId } = data;

    // Проверяем, не оплачена ли уже задача
    const alreadyPaid = await this.isTaskPaid(taskId);
    if (alreadyPaid) {
      throw new Error('Задача уже оплачена!');
    }

    // Обновляем поле is_paid в tasks
    await this.prisma.balance_history.create({
      data: {
        task_id: taskId,
        user_id: userId,
        reason_id: reasonId, // Например, 1 = "Оплата выполнена"
        val: amount,
      },
    });

    console.log(`Задача ${taskId} отмечена как оплаченная.`);
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

    // Optional direct filters
    if (query.category_id) where.category_id = query.category_id;
    if (query.status_id) {
      where.status_id = Array.isArray(query.status_id)
        ? { in: query.status_id.map(Number) }
        : Number(query.status_id);
    }

    if ('emergency_call' in query) {
      where.emergency_call = query.emergency_call;
    }

    if (query.executeAtFrom || query.executeAtTo) {
      where.execute_at = {
        ...(query.executeAtFrom ? { gte: new Date(query.executeAtFrom) } : {}),
        ...(query.executeAtTo ? { lte: new Date(query.executeAtTo) } : {}),
      };
    }

    // 🧠 Advanced filter: performer-based categories + their city
    if (query.performer_user_id) {
      const user = await this.prisma.users.findUnique({
        where: { id: query.performer_user_id },
        include: {
          user_category: { select: { category_id: true } },
        },
      });

      if (user) {
        const categoryIds = user.user_category.map((uc) => uc.category_id);
        where.category_id = { in: categoryIds };

        if (user.city_id) {
          where.city_id = user.city_id;
        }
      }
    } else if (query.city_id) {
      // City filter if performer is not provided
      where.city_id = query.city_id;
    }

    // 🔍 Final query
    const tasks = await this.prisma.tasks.findMany({
      where,
      include: {
        balance_history: true,
        users_tasks_performer_user_idTousers: {
          select: {
            id: true,
            username: true,
            fullname: true,
            phone: true,
          },
        },
      },
    });

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
    const existingTask = await this.prisma.tasks.findUnique({
      where: { id },
    });

    if (!existingTask) {
      throw new NotFoundException(`Задание с ID ${id} не найдено`);
    }

    console.log('update task dto:', updateTaskDto);

    if (updateTaskDto.performer_user_id) {
      const performerExists = await this.prisma.users.findUnique({
        where: { id: updateTaskDto.performer_user_id },
      });

      if (!performerExists) {
        throw new NotFoundException(
          `Исполнитель с ID ${updateTaskDto.performer_user_id} не найден`,
        );
      }
    }

    const updatedTask = await this.prisma.tasks.update({
      where: { id },
      data: {
        city_area: updateTaskDto.city_area || undefined,
        execute_at: updateTaskDto.execute_at
          ? new Date(updateTaskDto.execute_at)
          : undefined,
        description: updateTaskDto.description,
        comment: updateTaskDto.comment,
        price_min: updateTaskDto.price_min,
        price_max: updateTaskDto.price_max,
        commission: updateTaskDto.commission,
        phone: updateTaskDto.phone,
        address: updateTaskDto.address,
        status_id: updateTaskDto.status_id,
        performer_user_id: updateTaskDto.performer_user_id ?? null,
        emergency_call: updateTaskDto.emergency_call ?? false,
      },
      include: {
        users_tasks_performer_user_idTousers: {
          select: {
            id: true,
            username: true,
            fullname: true,
            phone: true,
          },
        },
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
