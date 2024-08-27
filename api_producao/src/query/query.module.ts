import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryController } from './query.controller';
import { QueryService } from './query.service';

@Module({
  providers: [QueryService, PrismaService],
  controllers: [QueryController],
})
export class QueryModule {}
