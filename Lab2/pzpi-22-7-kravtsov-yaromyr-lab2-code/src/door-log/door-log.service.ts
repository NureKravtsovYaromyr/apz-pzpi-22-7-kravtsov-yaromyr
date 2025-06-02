import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DoorLog } from './door-log.model';
import { Door } from '../door/door.model';
import { User } from '../user/user.model';
import { Zone } from '../zone/zone.model';

@Injectable()
export class DoorLogService {
  constructor(
    @InjectModel(DoorLog) private doorLogModel: typeof DoorLog,
    @InjectModel(Door) private doorModel: typeof Door,
    @InjectModel(Zone) private zoneModel: typeof Zone,
  ) {}

  async findAll(filters: { userId?: number; zoneId?: number; doorId?: number }) {
    const where: any = {};
    if (filters.userId) where.user_id = filters.userId;
    if (filters.doorId) where.door_id = filters.doorId;

    // Фільтрація по zoneId потребує JOIN
    if (filters.zoneId) {
      const doors = await this.doorModel.findAll({ where: { zone_id: filters.zoneId } });
      const doorIds = doors.map(d => d.id);
      where.door_id = doorIds;
    }

    return this.doorLogModel.findAll({
      where,
      include: [User, { model: Door, include: [Zone] }],
      order: [['timestamp', 'DESC']],
    });
  }

  async findOne(id: number) {
    const log = await this.doorLogModel.findByPk(id, {
      include: [User, { model: Door, include: [Zone] }],
    });
    if (!log) throw new NotFoundException('Log not found');
    return log;
  }

  async remove(id: number) {
    const log = await this.findOne(id);
    return log.destroy();
  }
}
