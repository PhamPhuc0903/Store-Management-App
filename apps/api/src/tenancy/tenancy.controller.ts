import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TenancyService } from './tenancy.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import {
  BootstrapOwnerStoreRequestDto,
  BootstrapOwnerStoreResponseDto,
} from './dto/bootstrap-owner-store.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthenticatedUser } from '../auth/authenticated-user';

@ApiTags('tenancy')
@ApiBearerAuth()
@Controller('tenancy')
export class TenancyController {
  constructor(private readonly tenancyService: TenancyService) {}

  @Post('bootstrap')
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({
    summary: 'Create an organization, first store, and OWNER membership',
  })
  @ApiCreatedResponse({ type: BootstrapOwnerStoreResponseDto })
  @ApiUnauthorizedResponse({ description: 'Bearer access token is missing or invalid.' })
  bootstrapOwnerStore(
    @CurrentUser() user: AuthenticatedUser,
    @Body() request: BootstrapOwnerStoreRequestDto,
  ): Promise<BootstrapOwnerStoreResponseDto> {
    return this.tenancyService.bootstrapOwnerStore(user.id, request);
  }
}
