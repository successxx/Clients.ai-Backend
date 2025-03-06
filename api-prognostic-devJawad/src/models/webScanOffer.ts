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
  import WebscanCampaign from "./webScanCampaign";
  
  @Table({
    tableName: "webscan_offers",
    timestamps: true,
  })
  export default class WebscanOffer extends Model {
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
  
    @ForeignKey(() => WebscanCampaign)
    @Column(DataType.INTEGER)
    campaignId!: number;
  
    @BelongsTo(() => WebscanCampaign)
    campaign!: WebscanCampaign;
  }
  