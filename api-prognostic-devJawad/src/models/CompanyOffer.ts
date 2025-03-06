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
import CompanyDetail from "./CompanyDetail";
import { Col } from "sequelize/types/utils";

@Table({
  tableName: "company_offers",
  timestamps: true,
})
export default class CompanyOffer extends Model {
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

  @AllowNull(true)
  @Column(DataType.TIME)
  startTime?: Date;

  @AllowNull(true)
  @Column(DataType.TIME)
  endTime?: Date;

  // @AllowNull(true)
  // @Column(DataType.DATE)
  // startDate?: Date;

  // @AllowNull(true)
  // @Column(DataType.DATE)
  // endDate?: Date;

  // Foreign key for the CompanyDetails model
  @ForeignKey(() => CompanyDetail)
  @Column(DataType.INTEGER)
  companyId!: number;

  // Define the many-to-one relationship
  @BelongsTo(() => CompanyDetail)
  company!: CompanyDetail;

  @AllowNull(false)
  @Column(DataType.TEXT)
  offerGoal!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  offerTopic!: string;
}
