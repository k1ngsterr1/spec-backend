import { Module } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { FcmController } from './fcm.controller';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Module({
  controllers: [FcmController],
  providers: [FcmService, PrismaService],
})
export class FcmModule {}
