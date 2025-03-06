import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  HasMany,
  ForeignKey,
  BelongsTo,
  Unique,
} from "sequelize-typescript";
import CompanyOffer from "./CompanyOffer";
import User from "./User";
import CompanyTestimonial from "./CompanyTestimonial";
import WebscanSubmission from "./webScanSubmission";
import QuizSubmission from "./quizSubmissions";

@Table({
  tableName: "company_details",
  timestamps: true,
})
export default class CompanyDetail extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  companyName!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  industry!: string;

  @AllowNull(false)
  @Column(DataType.TEXT("long"))
  primaryProductsOrServices!: string;

  @AllowNull(false)
  @Column(DataType.TEXT("long"))
  companyDescription!: string;

  @AllowNull(false)
  @Column(DataType.TEXT("long"))
  primaryGoal!: string;

  @AllowNull(false)
  @Column(DataType.TEXT("long"))
  targetAudience!: string;

  @AllowNull(false)
  @Column(DataType.TEXT("long"))
  primaryCustomerPainPoints!: string;

  // @AllowNull(false)
  // // @Unique
  // @Column(DataType.STRING)
  // subdomain!: string;

  @HasMany(() => CompanyOffer)
  offers!: CompanyOffer[];

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column(DataType.TEXT("long"))
  testimonials!: string;

  @HasMany(() => CompanyTestimonial)
  testimonialsList!: CompanyTestimonial[];

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isPrimary!: boolean;

  @AllowNull(true)
  @Column(DataType.STRING)
  smtpEmail!: string | null;

  @HasMany(() => WebscanSubmission)
  webscanSubmissions!: WebscanSubmission[];

  @HasMany(() => QuizSubmission)
  quizSubmission!: QuizSubmission[];
}
