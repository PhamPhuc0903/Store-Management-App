import { Injectable } from '@nestjs/common';
import {
  BootstrapOwnerStoreResult,
  SupabaseAdminService,
} from '../infrastructure/supabase/supabase-admin.service';
import { BootstrapOwnerStoreRequestDto } from './dto/bootstrap-owner-store.dto';

@Injectable()
export class TenancyService {
  constructor(private readonly supabaseAdmin: SupabaseAdminService) {}

  bootstrapOwnerStore(
    actorUserId: string,
    request: BootstrapOwnerStoreRequestDto,
  ): Promise<BootstrapOwnerStoreResult> {
    return this.supabaseAdmin.bootstrapOwnerStore({
      operationId: request.operationId,
      actorUserId,
      organizationName: request.organizationName,
      storeName: request.storeName,
    });
  }
}
