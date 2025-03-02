import { Injectable } from '@nestjs/common';
import { CreateTasksHistoryDto } from './dto/create-tasks-history.dto';
import { UpdateTasksHistoryDto } from './dto/update-tasks-history.dto';

@Injectable()
export class TasksHistoryService {
  create(createTasksHistoryDto: CreateTasksHistoryDto) {
    return 'This action adds a new tasksHistory';
  }

  findAll() {
    return `This action returns all tasksHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tasksHistory`;
  }

  update(id: number, updateTasksHistoryDto: UpdateTasksHistoryDto) {
    return `This action updates a #${id} tasksHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} tasksHistory`;
  }
}
