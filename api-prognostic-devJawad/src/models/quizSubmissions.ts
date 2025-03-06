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
import QuizCampaignEmail from "./quizCampaignEmail";
import QuizCampaign from "./quizCampaigns";
import CompanyDetail from "./CompanyDetail";

@Table({
  tableName: "quiz_submissions",
  timestamps: true,
})
export default class QuizSubmission extends Model {
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

  @HasMany(() => QuizCampaignEmail)
  emails!: QuizCampaignEmail[];

  @ForeignKey(() => QuizCampaign)
  @Column(DataType.INTEGER)
  quizCampaignId!: number;

  @BelongsTo(() => QuizCampaign)
  quizCampaign!: QuizCampaign;

  @ForeignKey(() => CompanyDetail)
  @Column(DataType.INTEGER)
  companyId!: number;

  @BelongsTo(() => CompanyDetail)
  company!: CompanyDetail;

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isCharged!: string;
}
