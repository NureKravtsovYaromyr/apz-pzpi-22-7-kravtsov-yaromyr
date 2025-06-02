import { Module } from '@nestjs/common';
import { DoorLogController } from './door-log.controller';
import { DoorLogService } from './door-log.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { DoorLog } from './door-log.model';
import { LoggerModule } from 'src/logger/logger.module';
import { Zone } from 'src/zone/zone.model';
import { Door } from 'src/door/door.model';

@Module({
    controllers: [DoorLogController],
    providers: [DoorLogService],
    imports: [SequelizeModule.forFeature([DoorLog, Zone,Door]), LoggerModule],
    exports: [DoorLogService]
})
export class DoorLogModule { }
