import { Module } from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { StatusesController } from './statuses.controller';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [StatusesController],
  providers: [StatusesService, PrismaService, JwtService],
})
export class StatusesModule {}
