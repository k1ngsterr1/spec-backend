import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class StatusesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(data: CreateStatusDto) {
    const status = await this.prisma.statuses.create({
      data: {
        name: data.name,
      },
    });

    return { success: 'Статус успешно создан!', status: status };
  }

  async findAll() {
    return await this.prisma.statuses.findMany();
  }

  async findOne(id: number) {
    const status = await this.prisma.statuses.findUnique({
      where: { id },
    });

    if (!status) {
      throw new NotFoundException(`Статус с ID ${id} не найден`);
    }

    return status;
  }

  async update(id: number, updateStatusDto: UpdateStatusDto) {
    const status = await this.prisma.statuses.findUnique({ where: { id } });

    if (!status) {
      throw new NotFoundException(`Статус с ID ${id} не найден`);
    }

    return await this.prisma.statuses.update({
      where: { id },
      data: {
        name: updateStatusDto.name,
      },
    });
  }

  async remove(id: number) {
    const status = await this.prisma.statuses.findUnique({ where: { id } });

    if (!status) {
      throw new NotFoundException(`Статус с ID ${id} не найден`);
    }

    await this.prisma.statuses.delete({ where: { id } });

    return { success: `Статус с ID ${id} удален` };
  }
}
