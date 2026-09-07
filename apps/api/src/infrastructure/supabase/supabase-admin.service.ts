import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface BootstrapOwnerStoreInput {
  operationId: string;
  actorUserId: string;
  organizationName: string;
  storeName: string;
}

export interface BootstrapOwnerStoreResult {
  organization: {
    id: string;
    name: string;
    version: number;
  };
  store: {
    id: string;
    organizationId: string;
    name: string;
    version: number;
  };
  membership: {
    id: string;
    organizationId: string;
    storeId: string;
    userId: string;
    role: 'OWNER';
    status: 'ACTIVE';
    version: number;
  };
}

interface PostgrestError {
  code?: unknown;
  message?: unknown;
}

@Injectable()
export class SupabaseAdminService {
  constructor(private readonly config: ConfigService) {}
  async bootstrapOwnerStore(input: BootstrapOwnerStoreInput): Promise<BootstrapOwnerStoreResult> {
    const supabaseUrl = this.requireConfig('SUPABASE_URL');
    const serviceRoleKey = this.requireConfig('SUPABASE_SERVICE_ROLE_KEY');
    let response: Response;
    try {
      response = await fetch(
        `${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/bootstrap_owner_store`,
        {
          method: 'POST',
          headers: {
            apikey: serviceRoleKey,
            authorization: `Bearer ${serviceRoleKey}`,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            p_operation_id: input.operationId,
            p_actor_user_id: input.actorUserId,
            p_organization_name: input.organizationName,
            p_store_name: input.storeName,
          }),
        },
      );
    } catch {
      throw new ServiceUnavailableException({
        code: 'DATA_PLATFORM_UNAVAILABLE',
        message: 'Data platform is unavailable.',
        retryable: true,
      });
    }
    if (!response.ok) {
      const error = await this.readError(response);
      this.throwMappedError(error);
    }
    return (await response.json()) as BootstrapOwnerStoreResult;
  }

  private requireConfig(name: 'SUPABASE_URL' | 'SUPABASE_SERVICE_ROLE_KEY'): string {
    const value = this.config.get<string>(name)?.trim();
    if (!value) {
      throw new InternalServerErrorException({
        code: 'DATA_PLATFORM_NOT_CONFIGURED',
        message: 'Data platform is not configured.',
        retryable: false,
      });
    }
    return value;
  }

  private async readError(response: Response): Promise<PostgrestError> {
    try {
      return (await response.json()) as PostgrestError;
    } catch {
      return {};
    }
  }

  private throwMappedError(error: PostgrestError): never {
    const postgresCode = typeof error.code === 'string' ? error.code : undefined;
    const postgresMessage = typeof error.message === 'string' ? error.message : undefined;
    if (postgresCode === '23505' && postgresMessage?.includes('operation_id')) {
      throw new ConflictException({
        code: 'OPERATION_ID_REUSED',
        message: 'The operation id was already used for a different command.',
        retryable: false,
      });
    }
    if (postgresCode === '22023') {
      throw new BadRequestException({
        code: 'INVALID_TENANCY_BOOTSTRAP',
        message: 'The organization or store input is invalid.',
        retryable: false,
      });
    }
    throw new InternalServerErrorException({
      code: 'TENANCY_BOOTSTRAP_FAILED',
      message: 'The store could not be created.',
      retryable: false,
    });
  }
}
