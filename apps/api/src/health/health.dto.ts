import {ApiProperty} from "@nestjs/swagger";


export class HealthResponseDto {
  @ApiProperty({example: 'ok'})
  status!: 'ok';

  @ApiProperty({example: 'store-management-api'})
  service!: string;

  @ApiProperty({example: '0.1.0'})
  version!: string;

  @ApiProperty({example: 'local'})
  environment!: string;

  @ApiProperty({example: '2026-08-16T00:00:00.000Z'})
  timestamp!: string;
}
