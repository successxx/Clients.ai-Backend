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
import QuizSubmission from "./quizSubmissions";
// import WebscanSubmission from "./webScanSubmission";

@Table({
  tableName: "quiz_campaign_emails",
  timestamps: true,
})
export default class QuizCampaignEmail extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.TEXT("long"))
  emailContent!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  emailSubject!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  recipientEmail!: string;

  @AllowNull(true)
  @ForeignKey(() => QuizSubmission)
  @Column(DataType.INTEGER)
  quizSubmissionId!: number;

  @BelongsTo(() => QuizSubmission)
  quizSubmission!: QuizSubmission;

  @AllowNull(true)
  @Column(DataType.STRING)
  emailName!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  submissionSerialCode!: string;
}

