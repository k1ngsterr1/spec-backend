import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CitiesController],
  providers: [CitiesService, PrismaService, JwtService],
})
export class CitiesModule {}
