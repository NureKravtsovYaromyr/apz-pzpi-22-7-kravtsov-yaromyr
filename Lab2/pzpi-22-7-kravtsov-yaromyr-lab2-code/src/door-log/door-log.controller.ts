import {
  Controller, Get, Param, Query, Delete, UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags
} from '@nestjs/swagger';
import { DoorLogService } from './door-log.service';
import { Roles } from 'src/role/roles-auth-decorator';
import { RoleGuard } from 'src/role/role.gurard';

@ApiTags('door-logs')
@Controller('door-logs')
export class DoorLogController {
  constructor(private readonly doorLogService: DoorLogService) {}

  @Get()
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all door logs (with filters)' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'zoneId', required: false })
  @ApiQuery({ name: 'doorId', required: false })
  getAll(
    @Query('userId') userId?: number,
    @Query('zoneId') zoneId?: number,
    @Query('doorId') doorId?: number,
  ) {
    return this.doorLogService.findAll({ userId, zoneId, doorId });
  }

  @Get(':id')
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one door log by ID' })
  @ApiParam({ name: 'id' })
  getOne(@Param('id') id: number) {
    return this.doorLogService.findOne(id);
  }

  @Delete(':id')
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete one door log by ID' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: number) {
    return this.doorLogService.remove(id);
  }
}
