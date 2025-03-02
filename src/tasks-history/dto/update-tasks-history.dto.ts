import { PartialType } from '@nestjs/mapped-types';
import { CreateTasksHistoryDto } from './create-tasks-history.dto';

export class UpdateTasksHistoryDto extends PartialType(CreateTasksHistoryDto) {}
