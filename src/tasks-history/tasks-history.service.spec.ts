import { Test, TestingModule } from '@nestjs/testing';
import { TasksHistoryService } from './tasks-history.service';

describe('TasksHistoryService', () => {
  let service: TasksHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksHistoryService],
    }).compile();

    service = module.get<TasksHistoryService>(TasksHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
