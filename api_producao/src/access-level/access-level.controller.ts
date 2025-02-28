import { Controller, Get, Param } from '@nestjs/common';
import { AccessLevelService } from './access-level.service';
import { AccessLevel } from './enum/access-level.enum';

@Controller('access-level')
export class AccessLevelController {
  constructor(private readonly accessLevelService: AccessLevelService) {}

  @Get()
  getAllLevels() {
    return this.accessLevelService.getAllAccessLevels();
  }

  @Get(':level')
  checkLevel(@Param('level') level: AccessLevel) {
    return { 
      level, 
      isValid: this.accessLevelService.isValidAccessLevel(level) 
    };
  }
}
