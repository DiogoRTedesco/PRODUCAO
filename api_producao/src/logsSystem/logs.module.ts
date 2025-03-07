import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { PrismaSqliteService } from 'src/prisma/prisma-sqlite.service';
import { LogsController } from './logs.controller';

@Module({
  providers: [LogsService, PrismaSqliteService],
  exports: [LogsService],
  controllers: [LogsController]
})
export class LogsModule {}
