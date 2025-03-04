import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('send-sms')
  receiveSms(@Body() sendSMSDto: any) {
    return this.usersService.sendSms(sendSMSDto);
  }

  @Post('verify-sms')
  sendSms(@Body() sendSMSDto: any) {
    return this.usersService.verifySms(sendSMSDto);
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
      username?: string;
      fullname?: string;
      role?: string;
    },
  ) {
    return this.usersService.findAll({
      id: query.id ? +query.id : undefined,
      username: query.username,
      fullname: query.fullname,
      role: query.role,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
