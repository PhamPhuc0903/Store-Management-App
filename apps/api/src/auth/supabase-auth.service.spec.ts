import { ConfigService } from '@nestjs/config';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SupabaseAuthService } from './supabase-auth.service';
import { ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';

const config = new ConfigService({
  SUPABASE_URL: 'http://127.0.0.1:54321',
  SUPABASE_ANON_KEY: 'test-anon-key',
});

describe('SupabaseAuthService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the authenticated Supabase user', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: 'user-123', email: 'owner@example.test' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const service = new SupabaseAuthService(config);
    await expect(service.getUser('access-token')).resolves.toEqual({
      id: 'user-123',
      email: 'owner@example.test',
    });
    expect(fetchMock).toHaveBeenCalledWith(
      'http://127.0.0.1:54321/auth/v1/user',
      expect.objectContaining({
        headers: expect.objectContaining({
          apikey: 'test-anon-key',
          authorization: 'Bearer access-token',
        }),
      }),
    );
  });

  it('rejects an invalid or expired token', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 401 })));
    const service = new SupabaseAuthService(config);
    await expect(service.getUser('bad-token')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('treats auth-provider network failure as retryable unavailability', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
    const service = new SupabaseAuthService(config);
    await expect(service.getUser('access-token')).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
