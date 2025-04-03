import { Injectable, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from './dto/create-admin.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /** REGISTER ADMIN */
  async register(createAdminDto: CreateAdminDto) {
    const { username, password } = createAdminDto;

    let admin = await this.prisma.users.findUnique({
      where: { username },
    });

    if (admin) {
      throw new HttpException('User already exists', 400);
    }

    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new admin user
    admin = await this.prisma.users.create({
      data: {
        username,
        phone: undefined,
        user_agent: '',
        password_hash: hashedPassword, // Store hashed password
        priority: 0,
        role: 'admin',
      },
    });

    // Generate JWT token
    const payload = { phone: admin.phone, id: admin.id, role: admin.role };
    const token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'Admin created successfully',
      admin,
      token,
    };
  }

  /** LOGIN ADMIN */
  async login(data: any) {
    const { username } = data;

    let admin = await this.prisma.users.findUnique({
      where: { username },
    });

    // Check if the admin exists
    if (!admin) {
      throw new HttpException('Admin not found', 404);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      data.password,
      admin.password_hash,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', 401);
    }

    // Generate JWT token
    const payload = { phone: admin.phone, id: admin.id, role: admin.role };
    const token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'Login successful',
      admin,
      token,
    };
  }
}
