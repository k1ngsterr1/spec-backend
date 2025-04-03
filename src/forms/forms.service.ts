import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class FormsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFormDto: any) {
    return await this.prisma.forms.create({
      data: createFormDto,
    });
  }

  async findAll() {
    return await this.prisma.forms.findMany();
  }

  async findOne(id: number) {
    const form = await this.prisma.forms.findUnique({
      where: { id },
    });

    if (!form) {
      throw new NotFoundException(`Форма с ID ${id} не найдена`);
    }

    return form;
  }

  async update(id: number, updateFormDto: UpdateFormDto) {
    await this.findOne(id); // Проверка существования

    return await this.prisma.forms.update({
      where: { id },
      data: updateFormDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Проверка существования

    return await this.prisma.forms.delete({
      where: { id },
    });
  }
}
