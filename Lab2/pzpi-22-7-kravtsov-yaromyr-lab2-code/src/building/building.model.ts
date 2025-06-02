import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from 'src/user/user.model';
import { Zone } from 'src/zone/zone.model';


@Table({ tableName: 'buildings', createdAt: false, updatedAt: false })
export class Building extends Model<Building> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  name: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  address: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  developer_id: number;
  @BelongsTo(() => User)
  developer: User;

  @HasMany(() => Zone)
  zones: Zone[];
}
