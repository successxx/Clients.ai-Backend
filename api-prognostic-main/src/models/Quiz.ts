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

    @AllowNull(false)
    @Column(DataType.DATE)
    creationDate!: Date;

    @ForeignKey(() => Campaign)
    @Column(DataType.INTEGER)
    campaignId!: number;

    @BelongsTo(() => Campaign)
    campaign!: Campaign;

    @HasMany(() => Question)
    questions!: Question[];
}