import { ApiProperty } from '@nestjs/swagger';
export class LoginDto{
    @ApiProperty({ example: 'admin', description: 'Start time of the training' })
    email: string;
    @ApiProperty({ example: 'admin', description: 'Start time of the training' })
    password:string;
}