import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import User from "./User";

@Table({ tableName: "subscriptions", timestamps: true })
export default class Subscription extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    onDelete: "CASCADE", // Ensures invoices are deleted when the user is deleted
    onUpdate: "CASCADE",
  })
  userId!: number;

  @Column(DataType.STRING)
  stripeSubscriptionId!: string;

  @Column(DataType.STRING)
  plan!: string;

  @Column(DataType.STRING)
  status!: string;

  @Column(DataType.DATE)
  currentPeriodStart!: Date;

  @Column(DataType.DATE)
  currentPeriodEnd!: Date;

  @BelongsTo(() => User)
  user!: User;
}
