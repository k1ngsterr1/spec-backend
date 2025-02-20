import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || '123',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  exports: [JwtModule], // Экспортируем для использования в других модулях
})
export class SharedModule {}
