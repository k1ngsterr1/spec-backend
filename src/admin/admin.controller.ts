import { Controller, Get, Post, Body, Req, Param } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminService } from './admin.service';
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

  @Get('is-admin/:id')
  async isAdmin(@Param('id') id: any) {
    const user = await this.prisma.users.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return {
        isAdmin: false,
      };
    }

    return {
      isAdmin: user?.role === 'admin',
    };
  }
}
