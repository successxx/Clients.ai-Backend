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
import CompanyDetail from "./CompanyDetail";

@Table({
  tableName: "company_testimonials",
  timestamps: true, // Includes createdAt and updatedAt
})
export default class CompanyTestimonial extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  content!: string; // Testimonial content

  @AllowNull(false)
  @Column(DataType.STRING)
  attribution!: string; // Customer name or company

  // Optional foreign key if testimonials are linked to a specific company
  @ForeignKey(() => CompanyDetail)
  @Column(DataType.INTEGER)
  companyId!: number;

  @BelongsTo(() => CompanyDetail)
  company!: CompanyDetail;
}
