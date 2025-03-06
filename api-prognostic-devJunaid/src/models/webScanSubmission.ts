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
  HasMany,
} from "sequelize-typescript";
import WebscanCampaign from "./webScanCampaign";
import WebScanCampaignEmail from "./WebScanCampaignEmail";
import CompanyDetail from "./CompanyDetail";

@Table({
  tableName: "webscan_submissions",
  timestamps: true,
})
export default class WebscanSubmission extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  firstName!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  lastName!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  website!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  typeFormId!: string;

  @HasMany(() => WebScanCampaignEmail)
  emails!: WebScanCampaignEmail[];

  @ForeignKey(() => WebscanCampaign)
  @Column(DataType.INTEGER)
  webscanCampaignId!: number;

  @BelongsTo(() => WebscanCampaign)
  webscanCampaign!: WebscanCampaign;

  @ForeignKey(() => CompanyDetail)
  @Column(DataType.INTEGER)
  companyId!: number;

  @BelongsTo(() => CompanyDetail)
  company!: CompanyDetail;

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isCharged!: string;
}
