import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateFcmDto } from './dto/create-fcm.dto';
import { UpdateFcmDto } from './dto/update-fcm.dto';

@Injectable()
export class FcmService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFcmDto: CreateFcmDto) {
    return await this.prisma.fcm_token.create({
      data: {
        temporaryKey: createFcmDto.temporaryKey,
        fcmToken: createFcmDto.fcmToken,
      },
    });
  }

  async findAll() {
    return await this.prisma.fcm_token.findMany();
  }

  async findOne(id: number) {
    const fcm = await this.prisma.fcm_token.findUnique({ where: { id } });
    if (!fcm) throw new NotFoundException(`FCM with id ${id} not found`);
    return fcm;
  }

  async update(id: number, updateFcmDto: UpdateFcmDto) {
    return await this.prisma.fcm_token.update({
      where: { id },
      data: {
        temporaryKey: updateFcmDto.temporaryKey,
        fcmToken: updateFcmDto.fcmToken,
        userId: updateFcmDto.userId,
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.fcm_token.delete({ where: { id } });
  }
}
