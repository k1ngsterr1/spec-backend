import { HttpException, Injectable } from '@nestjs/common';
import { SendSMSDto } from './dto/send-sms.dto';
import { ReceiveSMSDto } from './dto/receive-sms.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  sendSms(sendSMSDto: SendSMSDto) {
    const smsCode = this.configService.get<string>('SMS_CODE');

    if (smsCode) {
      return {
        success: sendSMSDto.code.toString() === smsCode,
        message: 'Using test SMS code',
      };
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
