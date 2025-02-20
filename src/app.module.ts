import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CitiesModule } from './cities/cities.module';
import { StatusesModule } from './statuses/statuses.module';
import { UsersModule } from './users/users.module';
import { UserModule } from './user/user.module';
import { TasksModule } from './tasks/tasks.module';
import { FormsModule } from './forms/forms.module';
import { StatModule } from './stat/stat.module';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { PrismaService } from './shared/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SharedModule,

    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // Load the correct .env file
      isGlobal: true,
    }),
    CitiesModule,
    StatusesModule,
    UsersModule,
    UserModule,
    TasksModule,
    FormsModule,
    StatModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
