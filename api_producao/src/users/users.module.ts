import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessLevelService } from 'src/access-level/access-level.service';
import { UsersController } from './users.controller';
import { LogsModule } from 'src/logsSystem/logs.module';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
    imports: [PrismaModule, LogsModule],
    providers: [UsersService, AccessLevelService,], 
    controllers: [UsersController],
    exports: [UsersService]
  })
export class UsersModule {}
