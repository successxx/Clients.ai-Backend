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
import User from "./User";
import Quiz from "./Quiz";

enum CampaignType {
  WEB_SCAN = "web_scan",
  QUIZ = "quiz",
}

enum CampaignStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DRAFT = "draft",
  COMPLETED = "completed",
}

@Table({
  tableName: "campaigns",
  timestamps: true,
})
export default class Campaign extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  campaignName!: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  startDate!: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  endDate!: Date;

  @AllowNull(false)
  @Column(DataType.TIME)
  startTime!: string;

  @AllowNull(false)
  @Column(DataType.TIME)
  endTime!: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(CampaignType)))
  type!: CampaignType;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(CampaignStatus)))
  status!: CampaignStatus;

  @AllowNull(false)
  @Column(DataType.DATE)
  creationDate!: Date;

  @ForeignKey(() => CompanyDetail)
  @Column(DataType.INTEGER)
  companyId!: number;

  @BelongsTo(() => CompanyDetail)
  company!: CompanyDetail;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => Quiz)
  quizzes!: Quiz[];

  @AllowNull(true)
  @Column(DataType.STRING)
  campaignPage!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  typeFormEmbedLink!: string;
}
