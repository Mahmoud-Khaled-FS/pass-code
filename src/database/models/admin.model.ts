import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../init';

type AdminAttributes = {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'owner';
};
type AdminCreationAttributes = Optional<AdminAttributes, 'id'>;
export type AdminModel = Model<AdminAttributes, AdminCreationAttributes>;
class Admin extends Model<AdminAttributes, AdminCreationAttributes> implements AdminAttributes {
  id!: number;
  email!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  role: 'admin' | 'owner';
}

Admin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      allowNull: false,
      type: DataTypes.STRING(25),
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING(25),
    },
    role: {
      allowNull: false,
      defaultValue: 'admin',
      type: DataTypes.STRING(5),
    },
  },
  { sequelize, tableName: 'admins' },
);

export default Admin;
