import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Campaign from "./Campaign";

@Table({
  tableName: "campaign_details_records",
  timestamps: true,
})
export default class CampaignDetailsRecord extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Campaign)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  campaignId!: number;

  @BelongsTo(() => Campaign) // BelongsTo to define the relation
  campaign!: Campaign;

  // Changed from JSONB to JSON
  @Column(DataType.JSON)
  companyDetails!: object;

  @Column(DataType.JSON) // Store offer details as JSON
  offerDetails!: object;
}
