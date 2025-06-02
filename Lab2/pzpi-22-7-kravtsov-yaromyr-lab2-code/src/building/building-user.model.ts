import { Table, Column, Model, ForeignKey, DataType, BelongsTo } from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Building } from './building.model';

@Table({ tableName: 'building_users', createdAt: false, updatedAt: false })
export class BuildingUser extends Model<BuildingUser> {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    id: number;

    @ForeignKey(() => Building)
    @Column({ type: DataType.INTEGER, allowNull: false })
    building_id: number;
    @BelongsTo(() => Building)
    building: Building;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    user_id: number;
    @BelongsTo(() => User)
    user: User;
}
