import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserAuthGuard } from 'src/shared/guards/user.auth.guard';
import { AdminAuthGuard } from 'src/shared/guards/admin.auth.guard';
import { User } from 'src/shared/decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(UserAuthGuard)
  async getMe(@User() user) {
    return await this.usersService.getMe(user.id);
  }

  @Post('send-sms')
  receiveSms(@Body() sendSMSDto: any) {
    return this.usersService.sendSms(sendSMSDto);
  }

  @Post('verify-sms')
  sendSms(@Body() sendSMSDto: any) {
    return this.usersService.verifySms(sendSMSDto);
  }

  @Post('link-fcm')
  linkFcm(@Body() data: any) {
    return this.usersService.linkFcm(data);
  }

  @Post('verify-phone')
  async verifyPhone(@Body() data: any) {
    return await this.usersService.verifyPhoneAndGenerateJwt(data);
  }

  @Post('save-user-agent')
  sendUserAgent(@Body() sendSMSDto: any) {
    return this.usersService.verifySms(sendSMSDto);
  }

  @Get('')
  findMany(
    @Query()
    query: {
      id?: string;
      fullname?: string;
      city_id: number;
      phoneNumber?: string;
    },
  ) {
    return this.usersService.findAll({
      id: query.id ? +query.id : undefined,
      city_id: Number(query.city_id),
      phoneNumber: query.phoneNumber,
      fullname: query.fullname,
    });
  }

  @Get('balance-stats')
  @UseGuards(UserAuthGuard)
  async getBalanceStats(@Request() req) {
    return await this.usersService.getBalanceStats(req.user.id);
  }

  @Get('/user/:id')
  @UseGuards(AdminAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch('/user/:id')
  @UseGuards(AdminAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete('/user/:id')
  @UseGuards(AdminAuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
