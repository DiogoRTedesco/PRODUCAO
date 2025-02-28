import { Module } from '@nestjs/common';
import { PrismaSqlServerService } from './prisma-sqlserver.service';
import { PrismaSqliteService } from './prisma-sqlite.service';

@Module({
  providers: [PrismaSqlServerService, PrismaSqliteService],
  exports: [PrismaSqlServerService, PrismaSqliteService],
})
export class PrismaModule {}
