import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginAdminDto } from './dto/login-admin.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginAdminDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { username: data.username },
    });

    if (!admin) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      admin.passwordHash,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload = { username: admin.username, id: admin.id, role: 'admin' };
    const token = this.jwtService.sign(payload);

    return { admin, token };
  }

  async register(data: RegisterAdminDto) {
    let user = await this.prisma.admin.findUnique({
      where: { username: data.username },
    });

    if (user) {
      throw new HttpException('Username already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Создаём нового администратора
    const admin = await this.prisma.admin.create({
      data: {
        username: data.username,
        passwordHash: hashedPassword,
      },
    });

    const payload = { username: admin.username, id: admin.id };
    const token = this.jwtService.sign(payload);

    return { user, token };
  }
}
