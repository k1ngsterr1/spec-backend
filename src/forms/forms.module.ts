import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { SharedModule } from 'src/shared/shared.module';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Module({
  imports: [SharedModule],
  controllers: [FormsController],
  providers: [FormsService, PrismaService],
})
export class FormsModule {}
