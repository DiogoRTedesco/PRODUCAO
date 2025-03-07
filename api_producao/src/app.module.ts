import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { QueryModule } from './query/query.module';
import { AccessLevelModule } from './access-level/access-level.module';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { LogsModule } from './logsSystem/logs.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, QueryModule, AccessLevelModule, UsersModule, LogsModule, AuthModule],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
