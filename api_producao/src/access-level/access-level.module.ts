import { Module } from '@nestjs/common';
import { AccessLevelService } from './access-level.service';
import { AccessLevelController } from './access-level.controller';

@Module({
  controllers: [AccessLevelController],
  providers: [AccessLevelService],
  exports: [AccessLevelService],
})
export class AccessLevelModule {}
