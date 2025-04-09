import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminService } from './admin.service';
import { AdminAuthGuard } from 'src/shared/guards/admin.auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  register(@Body() registerAdminDto: CreateAdminDto) {
    return this.adminService.register(registerAdminDto);
  }

  @Post('login')
  login(@Body() loginAdminDto: CreateAdminDto) {
    return this.adminService.login(loginAdminDto);
  }

  @Get('is-admin')
  isAdmin(@Req() req: any) {
    const user = req.user as any;
    return {
      isAdmin: user?.role === 'admin',
    };
  }
}
