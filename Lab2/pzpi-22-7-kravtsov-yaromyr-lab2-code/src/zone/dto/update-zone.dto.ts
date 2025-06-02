import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateZoneDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  type?: string;
}
