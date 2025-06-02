import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Door } from './door.model';
import { Zone } from '../zone/zone.model';
import { Building } from '../building/building.model';
import { DoorLog } from '../door-log/door-log.model';
import { UpdateDoorDto } from './dto/update-door.dto';
import { CreateDoorDto } from './dto/create-door.dto';

@Injectable()
export class DoorService {
  constructor(
    @InjectModel(Door) private doorModel: typeof Door,
    @InjectModel(Zone) private zoneModel: typeof Zone,
    @InjectModel(Building) private buildingModel: typeof Building,
    @InjectModel(DoorLog) private logModel: typeof DoorLog,
  ) { }

  async findAllByDeveloper(developerId: number) {
    const buildings = await this.buildingModel.findAll({ where: { developer_id: developerId } });
    const buildingIds = buildings.map(b => b.id);
    const zones = await this.zoneModel.findAll({ where: { building_id: buildingIds } });
    const zoneIds = zones.map(z => z.id);

    return this.doorModel.findAll({ where: { zone_id: zoneIds } });
  }

  async findOne(id: number) {
    const door = await this.doorModel.findByPk(id);
    if (!door) throw new NotFoundException('Door not found');
    return door;
  }

  async findByZone(zoneId: number) {
    return this.doorModel.findAll({ where: { zone_id: zoneId } });
  }

  async create(dto: CreateDoorDto) {
    return this.doorModel.create(dto);
  }

  async update(id: number, dto: UpdateDoorDto) {
    const door = await this.findOne(id);
    return door.update(dto);
  }

  async remove(id: number) {
    const door = await this.findOne(id);
    return door.destroy();
  }

  async getByDeviceId(deviceId: string) {
    const door = await this.doorModel.findOne({ where: { device_id: deviceId } });
    if (!door) throw new NotFoundException('Door not found');
    return door;
  }

  async iotOpen(deviceId: string, user_id: number) {
    const door = await this.getByDeviceId(deviceId);
    return this.logModel.create({
      door_id: door.id,
      user_id,
      timestamp: new Date(),
      action_type: 'open',
      source: 'iot',
    });
  }



  async getLogs(doorId: number) {
    return this.logModel.findAll({
      where: { door_id: doorId },
      order: [['timestamp', 'DESC']],
    });
  }
}
