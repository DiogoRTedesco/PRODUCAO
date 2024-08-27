import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { QueryModule } from './query/query.module';

@Module({
  imports: [PrismaModule, QueryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
