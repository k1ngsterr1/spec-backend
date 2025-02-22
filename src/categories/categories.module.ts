import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService, JwtService],
})
export class CategoriesModule {}
