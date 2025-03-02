import { Module } from '@nestjs/common';
import { TasksHistoryService } from './tasks-history.service';
import { TasksHistoryController } from './tasks-history.controller';

@Module({
  controllers: [TasksHistoryController],
  providers: [TasksHistoryService],
})
export class TasksHistoryModule {}
