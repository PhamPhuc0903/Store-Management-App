import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { SupabaseAuthService } from './supabase-auth.service';
import { SupabaseAuthGuard } from './supabase-auth.guard';

function contextFor(authorization?: string): {
  context: ExecutionContext;
  request: Request & { user?: { id: string } };
} {
  const request = {
    headers: authorization ? { authorization } : {},
  } as Request & { user?: { id: string } };
  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
  } as ExecutionContext;
  return { context, request };
}

describe('SupabaseAuthGuard', () => {
  it('requires a Bearer access token', async () => {
    const auth = { getUser: vi.fn() } as unknown as SupabaseAuthService;
    const guard = new SupabaseAuthGuard(auth);
    const { context } = contextFor();
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('attaches the authenticated user to the request', async () => {
    const auth = {
      getUser: vi.fn().mockResolvedValue({ id: 'user-123' }),
    } as unknown as SupabaseAuthService;
    const guard = new SupabaseAuthGuard(auth);
    const { context, request } = contextFor('Bearer access-token');
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(auth.getUser).toHaveBeenCalledWith('access-token');
    expect(request.user).toEqual({ id: 'user-123' });
  });
});
