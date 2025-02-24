import { Injectable } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(data: CreateCityDto) {
    const city = await this.prisma.cities.create({
      data: {
        name: data.name,
      },
    });

    return { message: 'Город успешно создан!', city: city };
  }

  findAll() {
    return this.prisma.cities.findMany();
  }

  findOne(id: number) {
    return this.prisma.cities.findFirst({
      where: { id },
    });
  }
}
