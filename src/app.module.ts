import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CitiesModule } from './cities/cities.module';
import { StatusesModule } from './statuses/statuses.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { FormsModule } from './forms/forms.module';
import { StatModule } from './stat/stat.module';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { PrismaService } from './shared/prisma/prisma.service';
import { CategoriesModule } from './categories/categories.module';
import { TasksHistoryModule } from './tasks-history/tasks-history.module';
import { AdminModule } from './admin/admin.module';
import { ApplicationTextModule } from './application-text/application-text.module';
import { FcmModule } from './fcm/fcm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // Load the correct .env file
      isGlobal: true,
    }),
    SharedModule,
    CitiesModule,
    StatusesModule,
    UsersModule,
    TasksModule,
    FormsModule,
    StatModule,
    CategoriesModule,
    TasksHistoryModule,
    AdminModule,
    ApplicationTextModule,
    FcmModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
