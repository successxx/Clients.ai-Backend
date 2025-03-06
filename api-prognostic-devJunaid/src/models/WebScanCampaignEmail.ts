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
  Default,
} from "sequelize-typescript";
import WebscanSubmission from "./webScanSubmission";

@Table({
  tableName: "web_scan_campaign_emails",
  timestamps: true,
})
export default class WebScanCampaignEmail extends Model {
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
  @ForeignKey(() => WebscanSubmission)
  @Column(DataType.INTEGER)
  webscanSubmissionId!: number;

  @BelongsTo(() => WebscanSubmission)
  webscanSubmission!: WebscanSubmission;

  @AllowNull(true)
  @Column(DataType.STRING)
  emailName!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  submissionSerialCode!: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  sendDate!: string;

  @AllowNull(false)
  @Default("pending")
  @Column(DataType.ENUM("pending", "sent", "failed"))
  status!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  failureReason!: string;
}
