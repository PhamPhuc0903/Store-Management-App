import { ConfigService } from '@nestjs/config';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SupabaseAdminService } from './supabase-admin.service';
import { ConflictException, ServiceUnavailableException } from '@nestjs/common';

const config = new ConfigService({
  SUPABASE_URL: 'http://127.0.0.1:54321',
  SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
});

const input = {
  operationId: '00000000-0000-4000-8000-000000000001',
  actorUserId: '00000000-0000-4000-8000-000000000002',
  organizationName: 'Gia Đình',
  storeName: 'Cửa hàng chính',
};

describe('SupabaseAdminService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('invokes the backend-only bootstrap RPC with service-role credentials', async () => {
    const result = {
      organization: { id: 'org', name: 'Gia Đình', version: 1 },
      store: {
        id: 'store',
        organizationId: 'org',
        name: 'Cửa hàng chính',
        version: 1,
      },
      membership: {
        id: 'membership',
        organizationId: 'org',
        storeId: 'store',
        userId: input.actorUserId,
        role: 'OWNER',
        status: 'ACTIVE',
        version: 1,
      },
    } as const;
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const service = new SupabaseAdminService(config);
    await expect(service.bootstrapOwnerStore(input)).resolves.toEqual(result);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://127.0.0.1:54321/rest/v1/rpc/bootstrap_owner_store',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          apikey: 'test-service-role-key',
          authorization: 'Bearer test-service-role-key',
        }),
      }),
    );
  });

  it('maps operation-id reuse to a stable conflict', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            code: '23505',
            message: 'operation_id has already been used for a different command',
          }),
          { status: 409 },
        ),
      ),
    );

    const service = new SupabaseAdminService(config);
    await expect(service.bootstrapOwnerStore(input)).rejects.toBeInstanceOf(ConflictException);
  });

  it('map data-platform network failures to retryable unavailability', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
    const service = new SupabaseAdminService(config);
    await expect(service.bootstrapOwnerStore(input)).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
