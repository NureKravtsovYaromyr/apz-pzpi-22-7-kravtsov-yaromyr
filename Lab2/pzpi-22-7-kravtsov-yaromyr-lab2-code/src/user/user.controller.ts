import {
  Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req,
  Res
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { Roles } from 'src/role/roles-auth-decorator';
import { RoleGuard } from 'src/role/role.gurard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  getAllUsers() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles(['developer', 'resident'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one user by ID' })
  @ApiParam({ name: 'id' })
  getUserById(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Get('profile')
  @Roles(['developer', 'resident'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile from token' })
  getProfile(@Req() req: Request) {
    return this.userService.findOne(req['user'].userId);
  }

  @Post('')
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new user (by developer)' })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }


  @Put(':id')
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id' })
  update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @Roles(['developer'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }

  @Get(':id/activity')
  @Roles(['developer', 'resident'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get door log activity for user' })
  @ApiParam({ name: 'id' })
  getActivity(@Param('id') id: number) {
    return this.userService.getActivity(id);
  }

  @Get(':id/zones')
  @Roles(['developer', 'resident'])
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get zones visited by user' })
  @ApiParam({ name: 'id' })
  getVisitedZones(@Param('id') id: number) {
    return this.userService.getVisitedZones(id);
  }

  @Post('login')
  @ApiOperation({ summary: 'User logining' })
  @ApiBody({ type: LoginDto })
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const userData = await this.userService.login(dto);
    res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 68 * 1000, httpOnly: true });
    res.cookie('deviceId', userData.deviceId, { maxAge: 30 * 24 * 60 * 68 * 1000, httpOnly: true });
    return res.status(200).json(userData);
  }

}

