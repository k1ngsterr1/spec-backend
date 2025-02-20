import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { AuthGuard } from './auth.guard';

@Injectable()
export class UserAuthGuard extends AuthGuard {
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

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return true;
    } catch (error) {
      console.error('JWT validation failed:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
