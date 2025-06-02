import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Building } from 'src/building/building.model';
import { Door } from 'src/door/door.model';


@Table({ tableName: 'zones', createdAt: false, updatedAt: false })
export class Zone extends Model<Zone> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  name: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  type: string;

  @ForeignKey(() => Building)
  @Column({ type: DataType.INTEGER, allowNull: false })
  building_id: number;
  @BelongsTo(() => Building)
  building: Building;

  @HasMany(() => Door)
  doors: Door[];
}
