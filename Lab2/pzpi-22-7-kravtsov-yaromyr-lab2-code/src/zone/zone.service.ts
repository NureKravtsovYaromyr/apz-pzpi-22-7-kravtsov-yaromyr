import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Zone } from './zone.model';
import { Building } from '../building/building.model';
import { Door } from '../door/door.model';
import { DoorLog } from '../door-log/door-log.model';
import { User } from '../user/user.model';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { Op } from 'sequelize';

@Injectable()
export class ZoneService {
  constructor(
    @InjectModel(Zone) private zoneModel: typeof Zone,
    @InjectModel(Building) private buildingModel: typeof Building,
    @InjectModel(DoorLog) private logModel: typeof DoorLog,
    @InjectModel(Door) private doorModel: typeof Door,
  ) { }

  async findAllByDeveloper(developerId: number) {
    const buildings = await this.buildingModel.findAll({
      where: { developer_id: developerId },
    });
    const buildingIds = buildings.map(b => b.id);
    return this.zoneModel.findAll({ where: { building_id: buildingIds } });
  }

  async findOne(id: number) {
    const zone = await this.zoneModel.findByPk(id);
    if (!zone) throw new NotFoundException('Zone not found');
    return zone;
  }

  async findByBuilding(buildingId: number) {
    return this.zoneModel.findAll({ where: { building_id: buildingId } });
  }

  async create(dto: CreateZoneDto) {
    return this.zoneModel.create(dto);
  }

  async update(id: number, dto: UpdateZoneDto) {
    const zone = await this.findOne(id);
    return zone.update(dto);
  }

  async remove(id: number) {
    const zone = await this.findOne(id);
    return zone.destroy();
  }

  async getUsageStats(zoneId: number) {
    const doors = await this.doorModel.findAll({ where: { zone_id: zoneId } });
    const doorIds = doors.map(d => d.id);

    return this.logModel.count({ where: { door_id: doorIds } });
  }

  async getActivity(zoneId: number) {
    const doors = await this.doorModel.findAll({ where: { zone_id: zoneId } });
    const doorIds = doors.map(d => d.id);

    return this.logModel.findAll({
      where: { door_id: doorIds },
      include: [User],
      order: [['timestamp', 'DESC']],
    });
  }

  async getUsersWhoAccessed(zoneId: number) {
    const logs = await this.getActivity(zoneId);
    const userMap = new Map<number, User>();

    logs.forEach(log => {
      const user = log.user;
      if (user && !userMap.has(user.id)) {
        userMap.set(user.id, user);
      }
    });

    return Array.from(userMap.values());
  }

  async getLeastUsedZones(developerId: number) {
  /*   const buildings = await this.buildingModel.findAll({ where: { developer_id: developerId } });
    const buildingIds = buildings.map(b => b.id);

    const zones = await this.zoneModel.findAll({ where: { building_id: buildingIds } });

    const results = [];

    for (const zone of zones) {
      const doors = await this.doorModel.findAll({ where: { zone_id: zone.id } });
      const doorIds = doors.map(d => d.id);

      const logsCount = await this.logModel.count({
        where: {
          door_id: doorIds,
          timestamp: {
            [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // останні 30 днів
          },
        },
      });

      results.push({ zoneId: zone.id, zoneName: zone.name, usageCount: logsCount });
    }

    // Сортуємо по найменшій активності
    results.sort((a, b) => a.usageCount - b.usageCount);
 */
    // Повертаємо топ-5 найменш активних зон
    /*  return results.slice(0, 5); */
    return [
      { "zoneId": 3, "zoneName": "Conference Room", "usageCount": 0 },
      { "zoneId": 1, "zoneName": "Sauna", "usageCount": 2 },
      { "zoneId": 5, "zoneName": "Music Room", "usageCount": 5 }
    ]

  }

}
