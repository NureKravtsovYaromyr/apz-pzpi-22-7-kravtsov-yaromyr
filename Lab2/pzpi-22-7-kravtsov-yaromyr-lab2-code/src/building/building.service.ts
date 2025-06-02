import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Building } from './building.model';
import { User } from '../user/user.model';
import { Zone } from '../zone/zone.model';
import { BuildingUser } from './building-user.model';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';

@Injectable()
export class BuildingService {
  constructor(
    @InjectModel(Building) private buildingModel: typeof Building,
    @InjectModel(BuildingUser) private buModel: typeof BuildingUser
  ) {}

  async findAllByDeveloper(developerId: number) {
    return this.buildingModel.findAll({
      where: { developer_id: developerId },
    });
  }

  async search(developerId: number, name?: string, address?: string) {
    return this.buildingModel.findAll({
      where: {
        developer_id: developerId,
        ...(name && { name }),
        ...(address && { address }),
      },
    });
  }

  async findOne(id: number) {
    const building = await this.buildingModel.findByPk(id, {
      include: [Zone],
    });
    if (!building) throw new NotFoundException('Building not found');
    return building;
  }

  async create(developerId: number, dto: CreateBuildingDto) {
    return this.buildingModel.create({ ...dto, developer_id: developerId });
  }

  async update(id: number, dto: UpdateBuildingDto) {
    const building = await this.findOne(id);
    return building.update(dto);
  }

  async remove(id: number) {
    const building = await this.findOne(id);
    return building.destroy();
  }

  async addUserToBuilding(buildingId: number, userId: number) {
    return this.buModel.create({ building_id: buildingId, user_id: userId });
  }

  async getUsers(buildingId: number) {
    const links = await this.buModel.findAll({
      where: { building_id: buildingId },
      include: [User],
    });

    return links.map(link => link['user']);
  }
}
