import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import User from "./User";

@Table({ tableName: "invoices", timestamps: true })
export default class Invoice extends Model {
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @Column(DataType.STRING)
  stripeInvoiceId!: string; 

  @Column(DataType.FLOAT)
  amountPaid!: number;

  @Column(DataType.DATE)
  paidAt!: Date;

  @Column(DataType.STRING)
  status!: string;

  @BelongsTo(() => User)
  user!: User;
}
