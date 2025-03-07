import { Injectable } from '@nestjs/common';
import { PrismaSqliteService } from 'src/prisma/prisma-sqlite.service';
import { LogsEnum } from './enum/logs.enum';

@Injectable()
export class LogsService {
  constructor(private readonly prisma: PrismaSqliteService) {}

  async createLogs(
    action: LogsEnum,
    userId: number,
    metadata?: Record<string, any>
  ) {
    if (!Object.values(LogsEnum).includes(action)) {
      throw new Error(`Ação inválida: ${action}`);
    }

    return this.prisma.logs.create({
      data: {
        action,
        userId,
        metadata: metadata ? JSON.stringify(metadata) : null // Convertendo para string
      }
    });
  }

  async getLogs(userId?: number, startDate?: string, endDate?: string) {
    const whereClause: any = {};

    if (userId) {
      whereClause.userId = userId;
    }

    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate), // Maior ou igual a startDate
        lte: new Date(endDate) // Menor ou igual a endDate
      };
    }

    const logs = await this.prisma.logs.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' } // Ordenando por data decrescente
    });

    return logs.map((log) => ({
      ...log,
      metadata: log.metadata ? JSON.parse(log.metadata) : null // Convertendo metadata de volta para JSON
    }));
  }
}
