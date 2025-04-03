import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { AuthGuard } from './auth.guard';

@Injectable()
export class AdminAuthGuard extends AuthGuard {
  constructor(
    public readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {
    super(jwtService);
  }

  async validateUser(payload: any): Promise<boolean> {
    try {
      if (!payload || !payload.id) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.prisma.users.findUnique({
        where: { id: payload.id },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      console.log('USER ROLE:', user.role);

      if (user.role != 'admin') {
        throw new ForbiddenException('Access denied: Admins only');
      }

      return true;
    } catch (error) {
      console.log('error:', error);
      console.error('Admin JWT validation failed:', error.message);
      throw error instanceof UnauthorizedException ||
        error instanceof ForbiddenException
        ? error
        : new UnauthorizedException('Invalid or expired token');
    }
  }
}
