import { Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUser } from './authenticated-user';

interface SupabaseUserResponse {
  id?: unknown;
  email?: unknown;
}

@Injectable()
export class SupabaseAuthService {
  constructor(private readonly config: ConfigService) {}

  async getUser(accessToken: string): Promise<AuthenticatedUser> {
    const supabaseUrl = this.requireConfig('SUPABASE_URL');
    const anonKey = this.requireConfig('SUPABASE_ANON_KEY');

    let response: Response;
    try {
      response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/user`, {
        method: 'GET',
        headers: {
          apikey: anonKey,
          authorization: `Bearer ${accessToken}`,
        },
      });
    } catch {
      throw new ServiceUnavailableException({
        code: 'AUTH_PROVIDER_UNAVAILABLE',
        message: 'Authentication provider is unavailable.',
        retryable: true,
      });
    }

    if (response.status === 401 || response.status === 403) {
      throw new UnauthorizedException({
        code: 'UNAUTHENTICATED',
        message: 'Access token is invalid or expired.',
        retryable: false,
      });
    }

    if (!response.ok) {
      throw new ServiceUnavailableException({
        code: 'AUTH_PROVIDER_UNAVAILABLE',
        message: 'Authentication provider is unavailable.',
        retryable: true,
      });
    }

    const body = (await response.json()) as SupabaseUserResponse;
    if (typeof body.id !== 'string' || body.id.length === 0) {
      throw new UnauthorizedException({
        code: 'UNAUTHENTICATED',
        message: 'Access token is invalid or expired.',
        retryable: false,
      });
    }

    return {
      id: body.id,
      ...(typeof body.email === 'string' ? { email: body.email } : {}),
    };
  }

  private requireConfig(name: 'SUPABASE_URL' | 'SUPABASE_ANON_KEY'): string {
    const value = this.config.get<string>(name)?.trim();
    if (!value) {
      throw new ServiceUnavailableException({
        code: 'AUTH_PROVIDER_NOT_CONFIGURED',
        message: 'Authentication provider is not configred.',
        retryable: false,
      });
    }
    return value;
  }
}
