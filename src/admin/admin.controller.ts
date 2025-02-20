import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginAdminDto } from './dto/login-admin.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  login(@Body() createAdminDto: LoginAdminDto) {
    return this.adminService.login(createAdminDto);
  }

  @Post('register')
  register(@Body() createAdminDto: RegisterAdminDto) {
    return this.adminService.register(createAdminDto);
  }
}
