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
import Quiz from "./Quiz";

enum QuestionType {
  RADIO = "radio",
  CHECKBOX = "checkbox",
  SELECT = "select",
  TEXT = "text",
}

@Table({
  tableName: "questions",
  timestamps: true,
})
export default class Question extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  question!: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(QuestionType)))
  type!: QuestionType; // Question type (e.g., 'radio', 'checkbox', 'select', 'text')

  @AllowNull(false)
  @Column(DataType.JSON)
  options!: {
    text: string;
    isCorrect: boolean;
  }[];

  @ForeignKey(() => Quiz)
  @Column(DataType.INTEGER)
  quizId!: number;

  @BelongsTo(() => Quiz)
  quiz!: Quiz;
}
