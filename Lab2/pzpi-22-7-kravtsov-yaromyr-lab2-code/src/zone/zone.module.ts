import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZoneController } from './zone.controller';
import { ZoneService } from './zone.service';
import { Zone } from './zone.model';
import { DoorLog } from 'src/door-log/door-log.model';
import { Building } from 'src/building/building.model';
import { Door } from 'src/door/door.model';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Zone, DoorLog, Building, Door]),
    LoggerModule,
  ],
  controllers: [ZoneController],
  providers: [ZoneService],
  exports: [
    ZoneService,
    SequelizeModule, // ❗️ обов’язково експортувати для інших модулів
  ],
})
export class ZoneModule {}
