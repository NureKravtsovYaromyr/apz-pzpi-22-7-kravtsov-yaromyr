import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Building } from './building.model';
import { BuildingUser } from './building-user.model';
import { BuildingController } from './building.controller';
import { BuildingService } from './building.service';
import { User } from '../user/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Building, BuildingUser, User])
  ],
  controllers: [BuildingController],
  providers: [BuildingService],
  exports: [BuildingService, SequelizeModule], // 👈 експорт моделі назовні
})
export class BuildingModule {}
