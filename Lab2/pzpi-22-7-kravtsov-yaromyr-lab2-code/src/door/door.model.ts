import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { DoorLog } from 'src/door-log/door-log.model';
import { Zone } from 'src/zone/zone.model';


@Table({ tableName: 'doors', createdAt: false, updatedAt: false })
export class Door extends Model<Door> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @ForeignKey(() => Zone)
  @Column({ type: DataType.INTEGER, allowNull: false })
  zone_id: number;
  @BelongsTo(() => Zone)
  zone: Zone;
  @Column({ type: DataType.STRING, allowNull: false })
  position: 'entry' | 'exit' | 'entry_exit';

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  device_id: string;

  @HasMany(() => DoorLog)
  doorLogs: DoorLog[];
}
