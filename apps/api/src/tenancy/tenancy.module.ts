import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SupabasePlatformModule } from '../infrastructure/supabase/supabase-platform.module';
import { TenancyController } from './tenancy.controller';
import { TenancyService } from './tenancy.service';

@Module({
  imports: [AuthModule, SupabasePlatformModule],
  controllers: [TenancyController],
  providers: [TenancyService],
})
export class TenancyModule {}
