import { HttpException, Injectable, Query } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
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

  async sendSms(data: any) {
    const BASE_URL = this.configService.get<string>('TELEGRAM_GATEWAY_URL');
    const TOKEN = this.configService.get<string>('TELEGRAM_GATEWAY_TOKEN');

    const HEADERS = {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    };

    const phoneNumber = data.phone;

    // Step 1: Check if the phone number can receive messages
    let requestId: string;
    try {
      const checkAbilityResponse = await axios.post(
        `${BASE_URL}checkSendAbility`,
        { phone_number: phoneNumber },
        { headers: HEADERS },
      );

      if (!checkAbilityResponse.data?.ok) {
        throw new HttpException(
          `User cannot receive messages: ${checkAbilityResponse.data?.error}`,
          400,
        );
      }

      requestId = checkAbilityResponse.data.result.request_id;
    } catch (error) {
      console.error(
        `Telegram Gateway Error (checkSendAbility): ${error.message}`,
      );
      throw new HttpException('Failed to verify phone number', 500);
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

  async verifySms(data: any) {
    const BASE_URL = this.configService.get<string>('TELEGRAM_GATEWAY_URL');
    const TOKEN = this.configService.get<string>('TELEGRAM_GATEWAY_TOKEN');

    const HEADERS = {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    };

    const { phone, code, request_id } = data;

    console.log(data);

    try {
      const verifyResponse = await axios.post(
        `${BASE_URL}checkVerificationStatus`,
        {
          phone_number: phone,
          code,
          request_id,
        },
        { headers: HEADERS },
      );

      if (!verifyResponse.data?.ok) {
        throw new HttpException(
          `Invalid verification code: ${verifyResponse.data?.error}`,
          400,
        );
      }

      // Step 2: Check if user already exists
      let user = await this.prisma.users.findUnique({
        where: { phone },
      });

      if (user) {
        throw new HttpException('User already exists', 400);
      }

      // Step 3: Create user after successful verification
      user = await this.prisma.users.create({
        data: {
          phone,
          password_hash: '',
          priority: 0,
          role: 'performer',
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

  async findAll(query: { role?: string; fullName?: string }) {
    const users = await this.prisma.users.findMany({
      where: {
        role: query.role,
        fullname: query.fullName,
      },
    });

    return users;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
