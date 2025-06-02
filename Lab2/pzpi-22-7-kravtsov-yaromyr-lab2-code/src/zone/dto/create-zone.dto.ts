import { ApiProperty } from '@nestjs/swagger';

export class CreateZoneDto {
  @ApiProperty({ example: 'Gym' })
  name: string;

  @ApiProperty({ example: 'fitness' })
  type: string;

  @ApiProperty({ example: 1 })
  building_id: number;
}
