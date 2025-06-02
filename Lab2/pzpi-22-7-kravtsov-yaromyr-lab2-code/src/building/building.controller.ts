import {
    Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards, Req
} from '@nestjs/common';
import {
    ApiBearerAuth, ApiOperation, ApiParam, ApiTags, ApiBody
} from '@nestjs/swagger';
import { BuildingService } from './building.service';
import { Request } from 'express';
import { Roles } from 'src/role/roles-auth-decorator';
import { RoleGuard } from 'src/role/role.gurard';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { CreateBuildingDto } from './dto/create-building.dto';
import { AddUserToBuildingDto } from './dto/add-user-to-building.dto';

@ApiTags('buildings')
@Controller('buildings')
export class BuildingController {
    constructor(private readonly buildingService: BuildingService) { }

    @Get()
    @Roles(['developer'])
    @UseGuards(RoleGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all buildings by current developer' })
    getAll(@Req() req: Request) {
        console.log(req['user'].userId)
        return this.buildingService.findAllByDeveloper(req['user'].userId);
    }

    @Get('search')
    @Roles(['developer'])
    @UseGuards(RoleGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Search buildings by name/address' })
    search(@Req() req: Request, @Query('name') name?: string, @Query('address') address?: string) {
        return this.buildingService.search(req['user'].userId, name, address);
    }

    @Get(':id')
    @Roles(['developer'])
    @UseGuards(RoleGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get one building by ID with users/zones' })
    @ApiParam({ name: 'id' })
    getOne(@Param('id') id: number) {
        return this.buildingService.findOne(id);
    }

    @Post()
    @Roles(['developer'])
    @UseGuards(RoleGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new building' })
    @ApiBody({ type: CreateBuildingDto })
    create(@Req() req: Request, @Body() dto: CreateBuildingDto) {
        return this.buildingService.create(req['user'].userId, dto);
    }

    @Put(':id')
    @Roles(['developer'])
    @UseGuards(RoleGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update building by ID' })
    @ApiParam({ name: 'id' })
    @ApiBody({ type: UpdateBuildingDto })
    update(@Param('id') id: number, @Body() dto: UpdateBuildingDto) {
        return this.buildingService.update(id, dto);
    }

    @Delete(':id')
    @Roles(['developer'])
    @UseGuards(RoleGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete building by ID' })
    @ApiParam({ name: 'id' })
    remove(@Param('id') id: number) {
        return this.buildingService.remove(id);
    }

    @Post(':id/users')
    @Roles(['developer'])
    @UseGuards(RoleGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add a user (resident) to building' })
    @ApiParam({ name: 'id' })
    @ApiBody({ type: AddUserToBuildingDto })
    addUser(@Param('id') id: number, @Body() dto: AddUserToBuildingDto) {
        return this.buildingService.addUserToBuilding(id, dto.user_id);
    }

    @Get(':id/users')
    @Roles(['developer'])
    @UseGuards(RoleGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all users in a building' })
    @ApiParam({ name: 'id' })
    getUsers(@Param('id') id: number) {
        return this.buildingService.getUsers(id);
    }
}
