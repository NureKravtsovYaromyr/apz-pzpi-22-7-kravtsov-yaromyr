import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Door } from '../door/door.model';
import { User } from '../user/user.model';

@Table({ tableName: 'door_logs', createdAt: false, updatedAt: false })
export class DoorLog extends Model<DoorLog> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @ForeignKey(() => Door)
  @Column({ type: DataType.INTEGER, allowNull: false })
  door_id: number;

  @BelongsTo(() => Door)
  door: Door;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @Column({ type: DataType.DATE, allowNull: false })
  timestamp: Date;

  @Column({ type: DataType.ENUM('open', 'failed'), allowNull: false })
  action_type: 'open' | 'failed';

  @Column({
    type: DataType.ENUM('manual', 'schedule', 'admin', 'mobile_app', 'iot'),
    allowNull: false,
  })
  source: 'manual' | 'schedule' | 'admin' | 'mobile_app' | 'iot';
}
