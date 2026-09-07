import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';
import { Transform } from 'class-transformer';

const trimString = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class BootstrapOwnerStoreRequestDto {
  @ApiProperty({
    format: 'uuid',
    description: 'Idempotency key generated once by the client for this command.',
  })
  @IsUUID()
  operationId!: string;

  @ApiProperty({ example: 'Cửa hàng Gia Đình' })
  @Transform(trimString)
  @IsString()
  @Length(1, 120)
  organizationName!: string;

  @ApiProperty({ example: 'Chi nhánh chính' })
  @Transform(trimString)
  @IsString()
  @Length(1, 120)
  storeName!: string;
}

export class BootstrapOrganizationResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ example: 1 })
  version!: number;
}

export class BootstrapStoreResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  organizationId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ example: 1 })
  version!: number;
}

export class BootstrapMembershipResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  organizationId!: string;

  @ApiProperty({ format: 'uuid' })
  storeId!: string;

  @ApiProperty({ format: 'uuid' })
  userId!: string;

  @ApiProperty({ enum: ['OWNER'] })
  role!: 'OWNER';

  @ApiProperty({ enum: ['ACTIVE'] })
  status!: 'ACTIVE';

  @ApiProperty({ example: 1 })
  version!: number;
}

export class BootstrapOwnerStoreResponseDto {
  @ApiProperty({ type: BootstrapOrganizationResponseDto })
  organization!: BootstrapOrganizationResponseDto;

  @ApiProperty({ type: BootstrapStoreResponseDto })
  store!: BootstrapStoreResponseDto;

  @ApiProperty({ type: BootstrapMembershipResponseDto })
  membership!: BootstrapMembershipResponseDto;
}
