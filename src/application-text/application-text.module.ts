import { Module } from '@nestjs/common';
import { ApplicationTextService } from './application-text.service';
import { ApplicationTextController } from './application-text.controller';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Module({
  controllers: [ApplicationTextController],
  providers: [ApplicationTextService, PrismaService],
})
export class ApplicationTextModule {}
