import { forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { DoorLog } from '../door-log/door-log.model';
import { Door } from '../door/door.model';
import { Zone } from '../zone/zone.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TokenService } from 'src/token/token.service';
import { SaveTokenDto } from 'src/token/dto/save-token.dto';
import { compare } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { PayloadDto } from 'src/token/dto/payload.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(DoorLog) private logModel: typeof DoorLog,

    @Inject(forwardRef(() => TokenService))
    private readonly tokenService: TokenService,
  ) { }

  async findAll() {
    return this.userModel.findAll();
  }

  async findOne(id: number) {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByPk(id: number) {
    return await this.userModel.findByPk(id);
  }

  async create(dto: CreateUserDto) {
    const hashPassword = await bcrypt.hash(dto.email, 3);
    return this.userModel.create({ ...dto, role: 'resident', password: hashPassword });
  }


  async createNewDeveloper(dto: CreateUserDto) {
    const hashPassword = await bcrypt.hash(dto.email, 3);
    return this.userModel.create({ ...dto, role: 'developer', password:hashPassword });
  }



  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    return user.update(dto);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return user.destroy();
  }

  async getActivity(id: number) {
    return this.logModel.findAll({
      where: { user_id: id },
      include: [{ model: Door, include: [Zone] }],
      order: [['timestamp', 'DESC']],
    });
  }

  async getVisitedZones(id: number) {
    const logs = await this.logModel.findAll({
      where: { user_id: id },
      include: [{ model: Door, include: [Zone] }],
    });

    const uniqueZones = new Map<number, Zone>();
    logs.forEach((log) => {
      const zone = log.door.zone;
      if (zone && !uniqueZones.has(zone.id)) {
        uniqueZones.set(zone.id, zone);
      }
    });

    return Array.from(uniqueZones.values());
  }


  async login(dto: LoginDto) {
    try {
      console.log(dto)
      const user = await this.userModel.findOne({
        where: { email: dto.email },
      });
      if (!user) {
        console.log('')
        throw new HttpException(
          `Ім'я користувача або пароль недійсні`,
          HttpStatus.NOT_FOUND,
        );
      }
      const isPassEquals = await compare(dto.password, user.password);

      if (!isPassEquals) {
        throw new HttpException(
          `Ім'я користувача або пароль недійсні`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const payload: PayloadDto = {
        userId: user.id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      const tokens = this.tokenService.generateTokens(payload);
      const tokenDto: SaveTokenDto = {
        userId: user.id,
        refreshToken: tokens.refreshToken,
      };
      const deviceId = this.tokenService.generateDeviceId();
      await this.tokenService.saveToken({ ...tokenDto, deviceId });

      return { ...tokens, deviceId };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
