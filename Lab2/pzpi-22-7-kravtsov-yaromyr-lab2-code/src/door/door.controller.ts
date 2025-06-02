import {
  Controller, Get, Post, Body, Param, Delete, Put, Req, UseGuards,
  Query
} from '@nestjs/common';
import {
  ApiBearerAuth, ApiOperation, ApiParam, ApiTags, ApiBody
} from '@nestjs/swagger';
import { DoorService } from './door.service';
import { Roles } from 'src/role/roles-auth-decorator';
import { RoleGuard } from 'src/role/role.gurard';
import { Request } from 'express';
import { CreateDoorDto } from './dto/create-door.dto';
import { UpdateDoorDto } from './dto/update-door.dto';

@ApiTags('doors')
@Controller('doors')
export class DoorController {
  constructor(private readonly doorService: DoorService) {}

  @Get()
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all doors for developer' })
  getAll(@Req() req: Request) {
    return this.doorService.findAllByDeveloper(req['user'].userId);
  }

  @Get(':id')
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get door by ID' })
  @ApiParam({ name: 'id' })
  getOne(@Param('id') id: number) {
    return this.doorService.findOne(id);
  }

  @Get('/zone/:zoneId')
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get doors for specific zone' })
  @ApiParam({ name: 'zoneId' })
  getByZone(@Param('zoneId') zoneId: number) {
    return this.doorService.findByZone(zoneId);
  }

  @Post()
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new door' })
  @ApiBody({ type: CreateDoorDto })
  create(@Body() dto: CreateDoorDto) {
    return this.doorService.create(dto);
  }

  @Put(':id')
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update door by ID' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateDoorDto })
  update(@Param('id') id: number, @Body() dto: UpdateDoorDto) {
    return this.doorService.update(id, dto);
  }

  @Delete(':id')
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete door by ID' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: number) {
    return this.doorService.remove(id);
  }

  @Get('/device/:deviceId')
  @ApiOperation({ summary: 'Get door by device ID' })
  @ApiParam({ name: 'deviceId' })
  getByDeviceId(@Param('deviceId') deviceId: string) {
    return this.doorService.getByDeviceId(deviceId);
  }

  @Post(':deviceId/open')
  @ApiOperation({ summary: 'IoT event: door opened by device ID' })
  @ApiParam({ name: 'deviceId' })
  open(@Param('deviceId') deviceId: string, @Query('user_id') user_id?: number) {
    return this.doorService.iotOpen(deviceId, user_id);
  }

  @Get(':id/logs')
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get logs of door openings' })
  @ApiParam({ name: 'id' })
  getLogs(@Param('id') id: number) {
    return this.doorService.getLogs(id);
  }
}
