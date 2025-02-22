import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, JwtService, PrismaService],
})
export class TasksModule {}
