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
  import QuizCampaign from "./quizCampaigns";
  
  @Table({
    tableName: "quiz_offers",
    timestamps: true,
  })
  export default class QuizOffer extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;
  
    @AllowNull(false)
    @Column(DataType.STRING)
    offerName!: string;
  
    @AllowNull(true)
    @Column(DataType.STRING)
    price?: string;
  
    @AllowNull(false)
    @Column(DataType.TEXT)
    offerDescription!: string;
  
    @AllowNull(false)
    @Column(DataType.TEXT)
    primaryBenefits!: string;
  
    @AllowNull(false)
    @Column(DataType.STRING)
    targetActionURL!: string;
  
    @AllowNull(false)
    @Column(DataType.TEXT)
    offerGoal!: string;
  
    @AllowNull(false)
    @Column(DataType.TEXT)
    offerTopic!: string;
  
    @ForeignKey(() => QuizCampaign)
    @Column(DataType.INTEGER)
    campaignId!: number;
  
    @BelongsTo(() => QuizCampaign)
    campaign!: QuizCampaign;
  }
  