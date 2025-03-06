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
  Unique,
} from "sequelize-typescript";
import CompanyDetail from "./CompanyDetail";

@Table({
  tableName: "company_smtp_config",
  timestamps: true,
})
export default class CompanySMTPConfig extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => CompanyDetail)
  @Column(DataType.INTEGER)
  companyId!: number;

  @BelongsTo(() => CompanyDetail)
  company!: CompanyDetail;

  @Unique({ name: "smtpHost_unique", msg: "smtpHost_should_be_unique" }) // add this line
  @AllowNull(false)
  @Column(DataType.STRING)
  smtpHost!: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  smtpPort!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  smtpUser!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  smtpPassword!: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  useSSL!: boolean;
}
