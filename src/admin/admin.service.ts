import { Injectable } from '@nestjs/common';
import { LoginAdminDto } from './dto/login-admin.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';

@Injectable()
export class AdminService {
  login(loginAdminDto: LoginAdminDto) {
    return 'This action adds a new admin';
  }

  register(registerAdminDto: RegisterAdminDto) {
    return 'This action adds a new admin';
  }
}
