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
  HasOne,
} from "sequelize-typescript";
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
  @Column(DataType.DATEONLY) // Only stores date (no time)
  startDate!: string; // Format: YYYY-MM-DD

  @AllowNull(false)
  @Column(DataType.DATEONLY) // Only stores date (no time)
  endDate!: string;

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

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @HasOne(() => Quiz)
  quiz!: Quiz;

  @AllowNull(true)
  @Column(DataType.STRING)
  typeFormEmbedLink!: string;
}
