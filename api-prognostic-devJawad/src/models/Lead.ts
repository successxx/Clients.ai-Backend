import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
} from "sequelize-typescript";

@Table({
  tableName: "leads",
  timestamps: true,
})
export default class Lead extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  firstName!: string;

  @Column(DataType.STRING)
  lastName!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  email!: string;

  @Column(DataType.STRING)
  phone!: string;

  @AllowNull(false)
  @Column(DataType.ENUM("WEB", "PHONE", "EMAIL", "REFERRAL", "OTHER"))
  source!: string;
}
