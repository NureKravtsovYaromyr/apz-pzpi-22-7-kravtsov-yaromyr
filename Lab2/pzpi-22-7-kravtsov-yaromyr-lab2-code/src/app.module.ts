import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { TokenModule } from './token/token.module';
import { User } from './user/user.model';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { BuildingService } from './building/building.service';
import { BuildingController } from './building/building.controller';
import { BuildingModule } from './building/building.module';
import { ZoneService } from './zone/zone.service';
import { ZoneController } from './zone/zone.controller';
import { ZoneModule } from './zone/zone.module';
import { DoorService } from './door/door.service';
import { DoorController } from './door/door.controller';
import { DoorModule } from './door/door.module';
import { DoorLogService } from './door-log/door-log.service';
import { DoorLogController } from './door-log/door-log.controller';
import { DoorLogModule } from './door-log/door-log.module';
import { Building } from './building/building.model';
import { Zone } from './zone/zone.model';
import { Door } from './door/door.model';
import { DoorLog } from './door-log/door-log.model';
import { Token } from './token/token.model';


@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Папка для сохранения файлов
    }),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'static'), // Путь к папке для статики
      serveRoot: '/static', // URL-эндпоинт для доступа к файлам
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      models: [User, Building, Zone, Door, DoorLog, Token],
      autoLoadModels: process.env.AUTO_LOAD_MODELS == 'true'
    }),
    TokenModule,
    UserModule,
    BuildingModule,
    ZoneModule,
    DoorModule,
    DoorLogModule
  ],
  providers: [BuildingService, ZoneService, DoorService, DoorLogService],
  controllers: [BuildingController, ZoneController, DoorController, DoorLogController]
})
export class AppModule { }
