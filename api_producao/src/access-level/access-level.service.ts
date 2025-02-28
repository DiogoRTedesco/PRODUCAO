import { Injectable } from '@nestjs/common';
import {AccessLevel} from './enum/access-level.enum'


@Injectable()
export class AccessLevelService {
  private readonly accessLevels = Object.values(AccessLevel);

  getAllAccessLevels(): string[] {
    return this.accessLevels;
  }

  isValidAccessLevel(level: AccessLevel): boolean {
    return this.accessLevels.includes(level);
  }
}
