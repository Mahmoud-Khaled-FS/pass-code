// شكل ال import يخض عارف بس تجاهله حاليا
import {
  Association,
  DataTypes,
  ForeignKey,
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
  HasOneGetAssociationMixin,
  HasOneCreateAssociationMixin,
  HasOneSetAssociationMixin,
  Model,
  NonAttribute,
  Optional,
} from 'sequelize';
import { Request } from 'express';

import { UserResponse } from '../../types/response';
import Password from './password.model';
import sequelize from '../init';
import UserSettings from './user-setting.model';
import { throwErrorRequest } from '../../lib/errors/error-request';

// ده ال type بتاع اليوزر الي فيه الcolumns الي هنعملها للداتابيز
type UserAttributes = {
  id: number;
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  imageProfile: string;
  DOB: Date;
  phone?: string;
  verified: boolean;
  disabled: Boolean;
  settingsId: ForeignKey<UserSettings['id']>;
};
// types برده بتساعدك
type UserCreationAttributes = Optional<UserAttributes, 'id' | 'disabled' | 'verified'>;
export type UserModel = Model<UserAttributes, UserCreationAttributes>;

// دي طريقه ممله جدا لتعريف ال module
// بس دي الطريقه الي لقيتها في ال docs
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  //  الاول هنعرف الاعمده بتاعتنا عادي الي هتبقا في الجدول
  id!: number;
  userName!: string;
  email!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  imageProfile!: string;
  DOB!: Date;
  phone: string;
  verified!: boolean;
  disabled!: Boolean;
  settingsId!: ForeignKey<UserSettings['id']>;

  //  اي حاجه قبلها declare
  //  دي عباىه عن methods
  // سيكوليزي بتعملك الميثود دي جاهزه تساعدك في العلاقات بين الجداول
  // ممكن تبان معقده بس هي سهله هتاخدها كوبي من الدوكيومنتيشن علي الموقع وتغير الاسم
  // ليه بنعملها بقا فببسطاه تايبسكريبت معندهاش علم بالميثودس دي فانت هنا بتعرفها ان المكتبه بتعمل الميثودس دي متقلقيش
  declare settings?: NonAttribute<UserSettings[]>;
  declare getSettings: HasOneGetAssociationMixin<UserSettings>;
  declare createSettings: HasOneCreateAssociationMixin<UserSettings>;
  declare setSettings: HasOneSetAssociationMixin<UserSettings, 'userId'>;

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

  declare static associations: {
    settings: Association<User, UserSettings>;
    passwords: Association<User, Password>;
  };

  // كده خلصنا يعتبر الميثودث والبروبيرتي الي تبع المكتبه دول بقا ميثودس انت بتكتبهم يساعدك انك تاخد الداتا علي طول
  // resposnse فانكشن بترجعلك الداتا جاهزه انك تبعتها للكلاينت علي طول
  response() {
    const date = new Date(this.DOB);
    const response: UserResponse = {
      id: this.id,
      userName: this.userName,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: `${this.firstName} ${this.lastName}`,
      imageUrl: `images/${this.imageProfile}`,
      verfied: this.verified,
      dateOfBirth: {
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        timestamp: date.toISOString(),
      },
    };
    return response;
  }
  // نفس الفكره بس للداتا الي هتحتاجها وانت بتعمل توكين
  forToken() {
    return {
      id: this.id,
      verified: this.verified,
    };
  }
  // دي ميثودس بتوفر عليك انك تجيب ال userId من الريكوست بعد كده تعمل فيتش في الداتا بيز في كل كنترولر
  static async getUserFromRequest(req: Request) {
    //  اول حاجه بخرج الid
    const id = req.userId;
    // بعمل سيرش عن اليوزر في الداتابيز بالاي دي بتاعه
    const user = await User.findByPk(id);
    // لو مفيش يوزر ببعت ايرور للكلاينت
    //  هنبص علي الايرور قدام
    if (!user) {
      return throwErrorRequest('User not found', 400);
    }
    //  لو اليوزر موجود برجعه
    //  الفانكشن دي هستخدمها في كل كنترولر تقريبا فهي مهم اني اشرحها عشان لما تشوفها متتلخبطش
    return user;
  }
}

// اخر حاجه هنعرف ال user model علي انه table في الجدول
// init بتحتاج منك تعرف الاعمده اولا حاجه
//  تاني براميتر هو options
// منهم واحد اجباري الي هو ال sequelize الي عرفناها في ../init.ts
// وممكن برده تغير اسم الجدول زي ما عملت
// بعد ما تخلص الملف ده ممكن تخش علي باقي الملفات في فولدر models
//  كلهم نفس الطريقه ولو في اختلاف هوضحه
// (./user-settings.model.ts) (./website.model.ts) (./password.model.ts)
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userName: {
      type: DataTypes.STRING(55),
      allowNull: false,
      unique: true,
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
    imageProfile: {
      type: DataTypes.STRING,
    },
    DOB: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    phone: DataTypes.STRING(55),
  },
  { sequelize, tableName: 'users' },
);

export default User;
