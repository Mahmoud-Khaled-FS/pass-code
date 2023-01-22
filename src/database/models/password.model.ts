import {
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  ForeignKey,
  Model,
  NonAttribute,
  Optional,
} from 'sequelize';
import { decrypt } from '../../lib/encrypt';
import { PasswordInPasswords, PasswordResponse, PasswordUserProvider } from '../../types/response';
import sequelize from '../init';
import User from './user.model';
import Website from './website.model';

type PasswordAttributes = {
  id: number;
  password: string;
  iv: string;
  title: string;
  email: string;
  userName: string;
  phone: string;
  url: string;
  userId: ForeignKey<User['id']>;
};

type PasswordCreationAttributes = Optional<PasswordAttributes, 'id' | 'email' | 'phone' | 'userName' | 'url'>;

export type PasswordModel = Model<PasswordAttributes, PasswordCreationAttributes>;

class Password extends Model<PasswordAttributes, PasswordCreationAttributes> implements PasswordAttributes {
  declare id: number;
  declare password: string;
  declare iv: string;
  declare title: string;
  declare userName: string;
  declare email: string;
  declare phone: string;
  declare url: string;
  declare userId: ForeignKey<User['id']>;
  declare websiteId: ForeignKey<Website['id']>;
  declare createAt: Date;

  // User realation
  declare user: NonAttribute<User>;
  declare getUser: BelongsToGetAssociationMixin<User>;
  declare setUser: BelongsToSetAssociationMixin<User, 'userId'>;
  declare createUser: BelongsToCreateAssociationMixin<User>;

  // Websites realation
  declare website: NonAttribute<Website>;
  declare getWebsite: BelongsToGetAssociationMixin<Website>;
  declare setWebsite: BelongsToSetAssociationMixin<Website, 'websiteId'>;
  declare createWebsite: BelongsToCreateAssociationMixin<Website>;

  decryptPassword() {
    return decrypt({ encryptedData: this.password, iv: this.iv });
  }

  response() {
    const decryptedPassword = decrypt({ encryptedData: this.password, iv: this.iv });
    const passwordFor: PasswordUserProvider[] = [];
    const hasEmail = !!this.email;
    const hasUserName = !!this.userName;
    const hasPhone = !!this.phone;
    let decryptedEmail = null;
    let decryptedPhone = null;
    let decryptedUserName = null;
    if (hasEmail) {
      passwordFor.push('email');
      decryptedEmail = decrypt({ encryptedData: this.email, iv: this.iv });
    }
    if (hasPhone) {
      passwordFor.push('phone');
      decryptedPhone = decrypt({ encryptedData: this.phone, iv: this.iv });
    }
    if (hasUserName) {
      passwordFor.push('username');
      decryptedUserName = decrypt({ encryptedData: this.userName, iv: this.iv });
    }

    const response: PasswordResponse = {
      id: this.id,
      userId: this.userId,
      title: this.title,
      password: decryptedPassword,
      passwordFor,
      hasUrl: !!this.url,
      email: decryptedEmail,
      phone: decryptedPhone,
      userName: decryptedUserName,
      url: this.url,
      createdAt: this.createAt,
    };
    if (this.website) {
      response.url = this.website.url;
      response.website = {
        id: this.website.id,
        name: this.website.name,
        url: this.website.url,
        icon: this.website.icon,
      };
    }
    return response;
  }
  // نفس فكره ال response بس لو هتبعت array

  groupResponse() {
    const passwordFor: PasswordUserProvider[] = [];
    const hasEmail = !!this.email;
    const hasUserName = !!this.userName;
    const hasPhone = !!this.phone;

    if (hasEmail) {
      passwordFor.push('email');
    }
    if (hasPhone) {
      passwordFor.push('phone');
    }
    if (hasUserName) {
      passwordFor.push('username');
    }
    const response: PasswordInPasswords = {
      id: this.id,
      userId: this.userId,
      title: this.title,
      passwordFor: passwordFor,
      hasUrl: !!this.url,
      hasWebsite: !!this.websiteId,
      websiteId: this.websiteId ? this.websiteId : undefined,
    };
    return response;
  }
}

Password.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    iv: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(55),
      allowNull: false,
    },
    email: DataTypes.STRING(255),
    userName: DataTypes.STRING(255),
    phone: DataTypes.STRING(50),
    url: DataTypes.STRING,
  },
  { sequelize, tableName: 'passwords', initialAutoIncrement: '10000' },
);

export default Password;
