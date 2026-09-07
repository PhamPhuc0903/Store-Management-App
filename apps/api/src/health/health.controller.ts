import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthResponseDto } from './health.dto';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}
  @Get()
  @ApiOperation({ summary: 'Check API availability' })
  @ApiResponse({ status: 200, type: HealthResponseDto })
  getHealth(): HealthResponseDto {
    return this.healthService.getHealth();
  }
}
