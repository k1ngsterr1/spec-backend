import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getMe(userId: any) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId }, // or `username`, `phone`, etc.
      include: {
        user_category: {
          include: {
            categories: {
              select: {
                id: true,
                name: true, // 👈 get category name
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return user;
  }

  async sendSms(data: any) {
    const smsRequests = new Map<string, { count: number; timestamp: number }>();

    const BASE_URL = this.configService.get<string>('TELEGRAM_GATEWAY_URL');
    const TOKEN = this.configService.get<string>('TELEGRAM_GATEWAY_TOKEN');

    const HEADERS = {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    };

    const phoneNumber = data.phone;
    const now = Date.now();

    if (smsRequests.has(phoneNumber)) {
      const request = smsRequests.get(phoneNumber) as any;
      if (request.count >= 3 && now - request.timestamp < 3600000) {
        throw new HttpException(
          'Слишком много запросов. Попробуйте позже.',
          429,
        );
      }
      request.count++;
    } else {
      smsRequests.set(phoneNumber, { count: 1, timestamp: now });
    }

    let requestId: string;

    try {
      const checkAbilityResponse = await axios.post(
        `${BASE_URL}checkSendAbility`,
        { phone_number: phoneNumber },
        { headers: HEADERS },
      );

      if (!checkAbilityResponse.data?.ok) {
        throw new HttpException(
          {
            status: 400,
            message: `Невозможно отправить сообщение: ${checkAbilityResponse.data?.error || 'Неизвестная ошибка'}`,
          },
          400,
        );
      }
      requestId = checkAbilityResponse.data.result.request_id;
    } catch (error) {
      console.error(
        `Telegram Gateway Error (checkSendAbility): ${error.message}`,
      );
      throw new HttpException(
        {
          status: 500,
          message: 'Ошибка связи с сервисом подтверждения номера.',
          details:
            error.response?.data || error.message || 'Неизвестная ошибка',
        },
        500,
      );
    }

    // Step 2: Send verification code via Telegram Gateway
    try {
      const sendMessagePayload = {
        phone_number: phoneNumber,
        code_length: 6,
        ttl: 60, // Code valid for 1 minute
        payload: 'auth_verification',
        callback_url: 'https://my.webhook.here/auth', // Optional webhook
        request_id: requestId, // Use request_id to avoid duplicate charges
      };

      const sendMessageResponse = await axios.post(
        `${BASE_URL}sendVerificationMessage`,
        sendMessagePayload,
        { headers: HEADERS },
      );

      if (!sendMessageResponse.data?.ok) {
        throw new HttpException(
          `Failed to send verification message: ${sendMessageResponse.data?.error}`,
          500,
        );
      }
    } catch (error) {
      console.error(
        `Telegram Gateway Error (sendVerificationMessage): ${error.message}`,
      );
      throw new HttpException('Failed to send verification code', 500);
    }

    return {
      success: true,
      message: 'Verification code sent via Telegram Gateway',
      request_id: requestId, // Save request_id for later verification
    };
  }

  async getBalanceStats(userId: number) {
    const balanceHistory = await this.prisma.balance_history.findMany({
      where: { user_id: userId },
      select: {
        reason_id: true,
        val: true,
      },
    });

    // Check if the user has balance history
    if (!balanceHistory.length) {
      return {
        userId,
        totalBalance: 0,
        details: {},
      };
    }

    // Aggregate balance statistics
    const stats: Record<number, { total: number; count: number }> = {};

    for (const entry of balanceHistory) {
      if (entry.reason_id === null) continue; // Ignore invalid entries

      if (!stats[entry.reason_id]) {
        stats[entry.reason_id] = { total: 0, count: 0 };
      }
      stats[entry.reason_id].total += entry.val;
      stats[entry.reason_id].count += 1;
    }

    return {
      userId,
      totalBalance: balanceHistory.reduce((sum, entry) => sum + entry.val, 0),
      details: stats,
    };
  }

  async verifySms(data: any) {
    const BASE_URL = this.configService.get<string>('TELEGRAM_GATEWAY_URL');
    const TOKEN = this.configService.get<string>('TELEGRAM_GATEWAY_TOKEN');

    const HEADERS = {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    };

    const { phone, code, user_agent, request_id } = data;

    if (!code || code == '') {
      throw new HttpException(`Неверный код верификации`, 400);
    }

    try {
      const verifyResponse = await axios.post(
        `${BASE_URL}checkVerificationStatus`,
        {
          phone_number: phone,
          code,
          user_agent,
          request_id,
        },
        { headers: HEADERS },
      );

      if (
        verifyResponse.data?.result.verification_status.status !== 'code_valid'
      ) {
        throw new HttpException(`Неверный код верификации`, 400);
      }

      let user = await this.prisma.users.findUnique({
        where: { phone },
      });

      if (user) {
        const payload = { id: user.id, phone: user.phone, role: user.role };
        const token = this.jwtService.sign(payload);

        return { token, id: user.id };
      }

      user = await this.prisma.users.create({
        data: {
          phone,
          user_agent,
          password_hash: data.password,
          priority: 0,
          role: 'user',
        },
      });

      const payload = { phone: user.phone, id: user.id, role: user.role };
      const token = this.jwtService.sign(payload);

      return {
        success: true,
        message: 'Phone number verified successfully',
        user,
        token,
      };
    } catch (error) {
      console.error(
        `Telegram Gateway Error (validateVerificationCode): ${error.message}`,
      );
      throw new HttpException('Failed to verify the code', 500);
    }
  }

  async linkFcm(data: any) {
    const connectedToken = await this.prisma.fcm_token.update({
      where: { temporaryKey: data.temporaryKey },
      data: { userId: data.id },
    });

    return connectedToken;
  }

  async findAll(query: {
    id?: number;
    username?: string;
    fullname?: string;
    city_id: number;
    phoneNumber?: string;
  }) {
    const where: any = {
      role: 'performer',
      city_id: query.city_id,
    };

    console.log('query:', query);

    if (query.id !== undefined) {
      where.id = query.id;
    }

    if (query.fullname) {
      const nameParts = query.fullname.split(' ').filter(Boolean); // Split by space
      where.OR = nameParts.map((part) => ({
        fullname: { contains: part, mode: 'insensitive' },
      }));
    }

    if (query.phoneNumber) {
      where.phone = query.phoneNumber;
    }

    const users = await this.prisma.users.findMany({
      where,
      select: {
        id: true,
        phone: true,
        city_id: true,
        fullname: true,
      },
    });

    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    return user;
  }

  async verifyPhoneAndGenerateJwt(data: any) {
    const phone = data.phone;

    const user = await this.prisma.users.findUnique({ where: { phone } });

    if (!user) {
      throw new UnauthorizedException('Phone number not found');
    }

    const payload = { id: user.id, phone: user.phone, role: user.role };
    const token = this.jwtService.sign(payload);

    console.log('lolka');

    return { token, id: user.id };
  }

  async update(id: number, updateUserDto: any) {
    const existingUser = await this.prisma.users.findUnique({ where: { id } });

    if (!existingUser) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    // Формируем объект `data`, добавляя только переданные поля
    const data: any = {};

    if (updateUserDto.username !== undefined) {
      data.username = updateUserDto.username;
    }
    if (updateUserDto.fullname !== undefined) {
      data.fullname = updateUserDto.fullname;
    }
    if (updateUserDto.phone !== undefined) {
      data.phone = updateUserDto.phone;
    }

    // Если объект `data` пустой, ничего не обновляем
    if (Object.keys(data).length === 0) {
      throw new BadRequestException('Нет данных для обновления');
    }

    const updatedUser = await this.prisma.users.update({
      where: { id },
      data,
    });

    return { success: `Пользователь #${id} обновлён`, user: updatedUser };
  }

  async remove(id: number) {
    const existingUser = await this.prisma.users.findUnique({ where: { id } });

    if (!existingUser) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    await this.prisma.users.delete({ where: { id } });

    return { success: `Пользователь #${id} удалён` };
  }
}
