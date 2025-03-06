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
  @Column({
    type: DataType.INTEGER,
    onDelete: "CASCADE", // Ensures invoices are deleted when the user is deleted
    onUpdate: "CASCADE",
  })
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

  @Column(DataType.TEXT("medium"))
  invoicePdf!: string;
}
