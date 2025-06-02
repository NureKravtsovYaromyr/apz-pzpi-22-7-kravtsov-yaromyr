import { ApiProperty } from '@nestjs/swagger';

export class CreateDoorDto {
  @ApiProperty({ example: 'entry' })
  position: 'entry' | 'exit' | 'entry_exit';

  @ApiProperty({ example: 'A1-B2-C3' })
  device_id: string;

  @ApiProperty({ example: 1 })
  zone_id: number;
}
