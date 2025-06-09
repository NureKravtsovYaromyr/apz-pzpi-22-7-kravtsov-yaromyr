import {
  Controller, Get, Post, Body, Param, Delete, Put, Req, UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth, ApiOperation, ApiParam, ApiTags, ApiBody
} from '@nestjs/swagger';
import { ZoneService } from './zone.service';
import { Roles } from 'src/role/roles-auth-decorator';
import { RoleGuard } from 'src/role/role.gurard';
import { Request } from 'express';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';

@ApiTags('zones')
@Controller('zones')
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) { }

  @Get()
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all zones for current developer' })
  getAll(@Req() req: Request) {
    return this.zoneService.findAllByDeveloper(req['user'].userId);
  }

  @Get('/one/:id')
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get zone by ID' })
  @ApiParam({ name: 'id' })
  getOne(@Param('id') id: number) {
    return this.zoneService.findOne(id);
  }

  @Get('/building/:buildingId')
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get zones by building ID' })
  @ApiParam({ name: 'buildingId' })
  getByBuilding(@Param('buildingId') buildingId: number) {
    return this.zoneService.findByBuilding(buildingId);
  }

  @Post()
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new zone' })
  @ApiBody({ type: CreateZoneDto })
  create(@Body() dto: CreateZoneDto) {
    return this.zoneService.create(dto);
  }

  @Put(':id')
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update zone by ID' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateZoneDto })
  update(@Param('id') id: number, @Body() dto: UpdateZoneDto) {
    return this.zoneService.update(id, dto);
  }

  @Delete(':id')
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete zone by ID' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: number) {
    return this.zoneService.remove(id);
  }

  @Get(':id/usage')
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get usage statistics of a zone' })
  @ApiParam({ name: 'id' })
  getUsage(@Param('id') id: number) {
    return this.zoneService.getUsageStats(id);
  }

  @Get(':id/activity')
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get activity log (door access) for a zone' })
  @ApiParam({ name: 'id' })
  getActivity(@Param('id') id: number) {
    return this.zoneService.getActivity(id);
  }

  @Get(':id/users')
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get users who accessed a zone' })
  @ApiParam({ name: 'id' })
  getUsers(@Param('id') id: number) {
    return this.zoneService.getZonesByUser(id);
  }

  @Get('/inactive')
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get inactive zones (low usage)' })
  async getInactiveZones(@Req() req: Request) {
    return this.zoneService.getLeastUsedZones(req['user'].id);
  }

}
