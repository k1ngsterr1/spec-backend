import { Test, TestingModule } from '@nestjs/testing';
import { TasksHistoryController } from './tasks-history.controller';
import { TasksHistoryService } from './tasks-history.service';

describe('TasksHistoryController', () => {
  let controller: TasksHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksHistoryController],
      providers: [TasksHistoryService],
    }).compile();

    controller = module.get<TasksHistoryController>(TasksHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
