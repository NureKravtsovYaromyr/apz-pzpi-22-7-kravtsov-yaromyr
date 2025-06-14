import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty()
  firstName: string;
    @ApiProperty()
  lastName: string;
    @ApiProperty()
  email: string;
  role: 'developer' | 'resident';
}
