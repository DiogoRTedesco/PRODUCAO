import { Module } from '@nestjs/common';
import { PrismaSqlServerService } from 'src/prisma/prisma-sqlserver.service';
import { QueryController } from './query.controller';
import { QueryService } from './query.service';
import { LogsModule } from 'src/logs/logs.module';

@Module({
  imports: [LogsModule],
  providers: [QueryService, PrismaSqlServerService],
  controllers: [QueryController]
})
export class QueryModule {}
