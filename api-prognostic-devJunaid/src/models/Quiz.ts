import Campaign from "./Campaign";
import Question from "./Question";
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
  Unique,
} from "sequelize-typescript";

@Table({
  tableName: "quizzes",
  timestamps: true,
})
export default class Quiz extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  topic!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description!: string;

  @ForeignKey(() => Campaign)
  @Column(DataType.INTEGER)
  campaignId!: number;

  @BelongsTo(() => Campaign)
  campaign!: Campaign;

  @AllowNull(false) // Make sure every quiz has a serial code
  @Unique // Ensure serial codes are unique
  @Column(DataType.STRING) // Serial code as a string
  serialCode!: string;

  @HasMany(() => Question)
  questions!: Question[];
}
