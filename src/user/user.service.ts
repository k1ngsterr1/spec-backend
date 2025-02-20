import { HttpException, Injectable } from '@nestjs/common';
import { SendSMSDto } from './dto/send-sms.dto';
import { ReceiveSMSDto } from './dto/receive-sms.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async sendSms(data: SendSMSDto) {
    const smsCode = this.configService.get<string>('SMS_CODE');

    if (smsCode) {
      let user = await this.prisma.user.findUnique({
        where: { phone: data.phone },
      });

      if (user) {
        throw new HttpException('User already exists', 400);
      }

      user = await this.prisma.user.create({
        data: {
          phone: data.phone,
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

  receiveSms(receiveSMSDto: ReceiveSMSDto) {
    const smsCode = this.configService.get<string>('SMS_CODE');

    if (smsCode) {
      return {
        success: receiveSMSDto.phone,
        message: `Hardcoded SMS code was sent to the ${receiveSMSDto.phone}`,
      };
    } else {
      return { success: true, message: 'Real SMS verification logic' };
    }
  }

  create() {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
