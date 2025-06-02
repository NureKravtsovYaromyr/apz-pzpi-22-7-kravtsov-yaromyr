import { ApiProperty } from "@nestjs/swagger";

export class AddUserToBuildingDto {
  @ApiProperty()
  user_id: number;
}
