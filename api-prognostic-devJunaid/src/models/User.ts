import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Unique,
  HasMany,
} from "sequelize-typescript";
import CompanyDetail from "./CompanyDetail";
import RefreshToken from "./RefreshToken";
import Offer from "./Offer";

@Table({
  tableName: "users",
  timestamps: true,
})
export default class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  email!: string;

  @Column(DataType.STRING)
  password!: string;

  @Column(DataType.STRING)
  phoneNumber!: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isDeleted!: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  profileImage?: string | null;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isEmailVerified!: boolean;

  @Column(DataType.STRING)
  otp!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  resetPasswordToken?: string | null;

  @Column({ type: DataType.DATE, allowNull: true })
  resetPasswordExpires?: Date | null;

  @HasMany(() => CompanyDetail)
  companyDetails!: CompanyDetail[];

  @HasMany(() => RefreshToken)
  refreshTokens!: RefreshToken[];

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isOnboarded!: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isPaymentVerified!: boolean;

  @HasMany(() => Offer)
  offers!: Offer[];

  @Column({ type: DataType.STRING, allowNull: true })
  stripeCustomerId?: string | null;
}
