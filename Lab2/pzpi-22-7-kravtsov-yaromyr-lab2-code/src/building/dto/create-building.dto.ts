import { ApiProperty } from "@nestjs/swagger";

export class CreateBuildingDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  address: string;
}
/* 

{
  "name": "Building 1",
  "address": "121212",
  "developer_id": 2
}
*/