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
  tableName: "offers",
  timestamps: true,
})
export default class Offer extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  offerName!: string;

  @AllowNull(true) // Optional field
  @Column(DataType.STRING)
  price?: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  offerDescription!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  primaryBenefits!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  targetActionURL!: string;

  // Foreign key for the User model
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  // Define the many-to-one relationship
  @BelongsTo(() => User)
  user!: User;
}
