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
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('register')
  register(@Body() registerAdminDto: CreateAdminDto) {
    return this.adminService.register(registerAdminDto);
  }

  @Post('login')
  login(@Body() loginAdminDto: CreateAdminDto) {
    return this.adminService.login(loginAdminDto);
  }

  @Get('is-admin')
  async isAdmin(@Req() req: any) {
    const user = await this.prisma.users.findUnique({
      where: { id: req.id },
    });

    console.log('req id:', req.id, 'user:', user);

    return {
      isAdmin: user?.role === 'admin',
    };
  }
}
