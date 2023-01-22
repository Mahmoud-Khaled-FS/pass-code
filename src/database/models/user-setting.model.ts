import {
  DataTypes,
  Model,
  NonAttribute,
  Optional,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
} from 'sequelize';

import sequelize from '../init';

type UserSettingsAttributes = {
  id: number;
  showPasswords: string;
  theme: string;
};

type UserSettingsCreationAttributes = Optional<UserSettingsAttributes, 'id' | 'showPasswords' | 'theme'>;

export type UserSettingsModel = Model<UserSettingsAttributes, UserSettingsCreationAttributes>;

class UserSettings
  extends Model<UserSettingsAttributes, UserSettingsCreationAttributes>
  implements UserSettingsAttributes
{
  id!: number;
  showPasswords!: string;
  theme!: string;

  declare user?: NonAttribute<UserSettings[]>;
  declare getUser: BelongsToGetAssociationMixin<UserSettings>;
  declare setUser: BelongsToSetAssociationMixin<UserSettings, 'userId'>;
}

UserSettings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    showPasswords: {
      defaultValue: true,
      type: DataTypes.BOOLEAN,
    },
    theme: {
      defaultValue: 'auto',
      type: DataTypes.STRING(20),
    },
  },
  { sequelize, tableName: 'user_settings' },
);

export default UserSettings;
