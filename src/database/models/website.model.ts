import {
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  Model,
  NonAttribute,
  Optional,
} from 'sequelize';
import sequelize from '../init';
import Password from './password.model';

type WebsiteAttributes = {
  id: number;
  name: string;
  url: string;
  icon: string;
};

type WebsiteCreationAttributes = Optional<WebsiteAttributes, 'id'>;

export type WebsiteModel = Model<WebsiteAttributes, WebsiteCreationAttributes>;

class Website extends Model<WebsiteAttributes, WebsiteCreationAttributes> implements WebsiteAttributes {
  declare id: number;
  declare name: string;
  declare url: string;
  declare icon: string;

  // Password relation

  declare getPasswords: HasManyGetAssociationsMixin<Password>;
  declare addPassword: HasManyAddAssociationMixin<Password, number>;
  declare addPasswords: HasManyAddAssociationsMixin<Password, number>;
  declare setPasswords: HasManySetAssociationsMixin<Password, number>;
  declare removePassword: HasManyRemoveAssociationMixin<Password, number>;
  declare removePasswords: HasManyRemoveAssociationsMixin<Password, number>;
  declare hasPassword: HasManyHasAssociationMixin<Password, number>;
  declare hasPasswords: HasManyHasAssociationsMixin<Password, number>;
  declare countPasswords: HasManyCountAssociationsMixin;
  declare createPassword: HasManyCreateAssociationMixin<Password, 'userId'>;
  declare passwords?: NonAttribute<Password[]>;
}
Website.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(55),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, tableName: 'websites' },
);

export default Website;
