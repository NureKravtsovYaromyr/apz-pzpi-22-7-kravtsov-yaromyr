import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDoorDto {
  @ApiPropertyOptional()
  position?: 'entry' | 'exit' | 'entry_exit';

  @ApiPropertyOptional()
  device_id?: string;
}
