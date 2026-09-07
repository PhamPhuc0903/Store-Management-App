import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthResponseDto } from './health.dto';

@Injectable()
export class HealthService {
  constructor(private readonly config: ConfigService) {}
  getHealth(): HealthResponseDto {
    return {
      status: 'ok',
      service: 'store-management-api',
      version: '0.1.0',
      environment: this.config.get<string>('APP_ENV', 'local'),
      timestamp: new Date().toISOString(),
    };
  }
}
