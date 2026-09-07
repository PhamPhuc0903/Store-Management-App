import { describe, expect, it, vi } from 'vitest';
import { SupabaseAdminService } from '../infrastructure/supabase/supabase-admin.service';
import { TenancyService } from './tenancy.service';

describe('TenancyService', () => {
  it('binds the authenticated actor to the owner-store bootstrap command', async () => {
    const bootstrapOwnerStore = vi.fn().mockResolvedValue({});
    const supabaseAdmin = {
      bootstrapOwnerStore,
    } as unknown as SupabaseAdminService;
    const service = new TenancyService(supabaseAdmin);
    const request = {
      operationId: '00000000-0000-4000-8000-000000000001',
      organizationName: 'Gia Đình',
      storeName: 'Cửa hàng chính',
    };
    await service.bootstrapOwnerStore('user-123', request);
    expect(bootstrapOwnerStore).toHaveBeenCalledWith({
      operationId: request.operationId,
      actorUserId: 'user-123',
      organizationName: 'Gia Đình',
      storeName: 'Cửa hàng chính',
    });
  });
});
