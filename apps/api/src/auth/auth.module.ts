import { Module } from '@nestjs/common';
import { SupabaseAuthService } from './supabase-auth.service';
import { SupabaseAuthGuard } from './supabase-auth.guard';

@Module({
  providers: [SupabaseAuthService, SupabaseAuthGuard],
  exports: [SupabaseAuthService, SupabaseAuthGuard],
})
export class AuthModule {}
