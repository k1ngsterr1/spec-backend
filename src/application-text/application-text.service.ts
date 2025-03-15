import { Injectable } from '@nestjs/common';
import { CreateApplicationTextDto } from './dto/create-application-text.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class ApplicationTextService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateApplicationTextDto) {
    const application = await this.prisma.no_application_text.create({
      data: {
        text: data.text,
      },
    });

    return { success: 'Текст успешно создан!', application };
  }

  async findOne() {
    const application = await this.prisma.no_application_text.findFirst();
    return application;
  }
}
