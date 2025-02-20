import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { ReceiveSMSDto } from './dto/receive-sms.dto';
import { SendSMSDto } from './dto/send-sms.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('receive-sms')
  receiveSms(@Body() sendSMSDto: ReceiveSMSDto) {
    return this.userService.receiveSms(sendSMSDto);
  }

  @Post('send-sms')
  sendSms(@Body() sendSMSDto: SendSMSDto) {
    return this.userService.sendSms(sendSMSDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
