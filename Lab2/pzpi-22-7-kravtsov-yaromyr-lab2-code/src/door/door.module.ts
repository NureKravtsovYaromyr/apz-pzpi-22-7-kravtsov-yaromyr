import { Module } from '@nestjs/common';
import { DoorController } from './door.controller';
import { DoorService } from './door.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoggerModule } from 'src/logger/logger.module';
import { Door } from './door.model';
import { DoorLog } from 'src/door-log/door-log.model';
import { Building } from 'src/building/building.model';
import { Zone } from 'src/zone/zone.model';

@Module({
    controllers: [DoorController],
    providers: [DoorService],
    imports: [SequelizeModule.forFeature([Door, DoorLog, Building, Zone]), LoggerModule],
    exports: [DoorService]
})
export class DoorModule { }
