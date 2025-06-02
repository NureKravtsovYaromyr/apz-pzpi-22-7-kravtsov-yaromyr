import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { DoorLog } from 'src/door-log/door-log.model';
import { TokenModule } from 'src/token/token.module';
import { FilesModule } from 'src/files/files.module';
import { LoggerModule } from 'src/logger/logger.module';


@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [SequelizeModule.forFeature([User, DoorLog]), forwardRef(() =>TokenModule), FilesModule,LoggerModule],
  exports: [UserService]
  
})
export class UserModule {}
