import { AuthenticatedUser } from './authenticated-user';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseAuthService } from './supabase-auth.service';
import type { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly auth: SupabaseAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const accessToken = this.readBearerToken(request.headers.authorization);
    request.user = await this.auth.getUser(accessToken);
    return true;
  }

  private readBearerToken(header: string | undefined): string {
    if (!header) {
      throw this.unauthenticated();
    }
    const match = /^Bearer\s+(.+)$/i.exec(header.trim());
    const token = match?.[1]?.trim();
    if (!token) {
      throw this.unauthenticated();
    }
    return token;
  }

  private unauthenticated(): UnauthorizedException {
    return new UnauthorizedException({
      code: 'UNAUTHENTICATED',
      message: 'A valid Bearer access token is required.',
      retryable: false,
    });
  }
}
