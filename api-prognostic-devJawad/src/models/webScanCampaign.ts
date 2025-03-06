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
import CompanyDetail from "./CompanyDetail";
import WebscanOffer from "./webScanOffer";
import WebscanSubmission from "./webScanSubmission";

@Table({
  tableName: "webscan_campaigns",
  timestamps: true,
})
export default class WebscanCampaign extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  campaignName!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  testimonial!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  typeFormEmbeddedLink?: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  typeFormId?: string;

  @ForeignKey(() => CompanyDetail)
  @Column(DataType.INTEGER)
  companyId!: number;

  @BelongsTo(() => CompanyDetail)
  company!: CompanyDetail;

  @HasMany(() => WebscanOffer)
  offers!: WebscanOffer[];

  @HasMany(() => WebscanSubmission)
  webscanSubmissions!: WebscanSubmission[];

  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  status!: boolean;

  @AllowNull(true)
  @Column(DataType.STRING)
  serialCode?: string;

  @AllowNull(true)
  @Column(DataType.TEXT('long'))
  htmlEmbeddedCode?: string;
  
}
