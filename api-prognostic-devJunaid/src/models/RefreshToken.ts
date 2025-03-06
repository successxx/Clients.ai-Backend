import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import User from "./User";

@Table({
  tableName: "refresh_tokens",
  timestamps: true, 
})
export default class RefreshToken extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.TEXT("long"))
  token!: string;

  // Foreign key for the User model
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  // Define the many-to-one relationship
  @BelongsTo(() => User)
  user!: User;
}
