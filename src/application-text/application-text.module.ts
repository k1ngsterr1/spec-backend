import { Module } from '@nestjs/common';
import { ApplicationTextService } from './application-text.service';
import { ApplicationTextController } from './application-text.controller';

@Module({
  controllers: [ApplicationTextController],
  providers: [ApplicationTextService],
})
export class ApplicationTextModule {}
