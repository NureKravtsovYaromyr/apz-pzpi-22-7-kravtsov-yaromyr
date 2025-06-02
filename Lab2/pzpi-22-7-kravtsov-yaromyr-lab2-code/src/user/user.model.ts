import {
  Model,
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Building } from 'src/building/building.model';
import { DoorLog } from 'src/door-log/door-log.model';

// ===== USERS =====

interface UserCreationAttrs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'developer' | 'resident';
}

@Table({ tableName: 'users', createdAt: false, updatedAt: false })
export class User extends Model<User, UserCreationAttrs> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  firstName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lastName: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, allowNull: false })
  role: 'developer' | 'resident';

  @HasMany(() => Building)
  buildings: Building[];

  @HasMany(() => DoorLog)
  doorLogs: DoorLog[];
}