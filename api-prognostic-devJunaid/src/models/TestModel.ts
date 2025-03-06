import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  timestamps: true,
})
class TestModel extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nameoftest!: string;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  age!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive!: boolean;
}

export default TestModel;
