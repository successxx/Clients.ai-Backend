import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
  } from "sequelize-typescript";
  import User from "./User";
  
  @Table({ tableName: "subscriptions", timestamps: true })
  export default class Subscription extends Model {
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    userId!: number;
  
    @Column(DataType.STRING)
    stripeSubscriptionId!: string;
  
    @Column(DataType.STRING)
    plan!: string; 
  
    @Column(DataType.STRING)
    status!: string; 
  
    @Column(DataType.DATE)
    currentPeriodStart!: Date;
  
    @Column(DataType.DATE)
    currentPeriodEnd!: Date;
  
    @BelongsTo(() => User)
    user!: User;
  }
  