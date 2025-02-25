import { HttpException, Injectable, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async sendSms(data: any) {
    const smsCode = this.configService.get<string>('SMS_CODE');

    if (smsCode) {
      let user = await this.prisma.users.findUnique({
        where: { phone: data.phone },
      });

      if (user) {
        throw new HttpException('User already exists', 400);
      }

      user = await this.prisma.users.create({
        data: {
          phone: data.phone,
          password_hash: '',
          priority: 0,
          role: 'performer',
        },
      });

      const payload = { phone: user.phone, id: user.id, role: user.role };
      const token = this.jwtService.sign(payload);

      return { user, token };
    } else {
      return { success: true, message: 'Real SMS verification logic' };
    }
  }

  async receiveSms(receiveSMSDto: any) {
    const smsCode = this.configService.get<string>('SMS_CODE');

    if (smsCode) {
      return {
        phone: receiveSMSDto.phone,
        message: `Hardcoded SMS code was sent to the ${receiveSMSDto.phone}`,
      };
    } else {
      return { success: true, message: 'Real SMS verification logic' };
    }
  }

  async findAll(query: { role?: string; fullName?: string }) {
    const users = await this.prisma.users.findMany({
      where: {
        role: query.role,
        fullname: query.fullName,
      },
    });

    return users;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
