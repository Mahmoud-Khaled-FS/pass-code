// قبل ما تقرا الكود الي هنا روح لملف
// ./init.ts
// عشان هنعمل الكونجريشن بتاعه الداتابيز
import sequelize from './init';
import Password from './models/password.model';
import UserSetting from './models/user-setting.model';
import User from './models/user.model';
import Website from './models/website.model';

export default async () => {
  try {
    // ممكن تبص علي ال user model الاول (./models/user.model.ts)
    // قريت الملفات الي في فولدر model?
    // دلوقتي هنعمل الريليشن بين الجداول
    //  اول حاجه اليوزر والباسورد(one to many)
    User.hasMany(Password, { foreignKey: 'userId', as: 'passwords', onDelete: 'CASCADE' });
    Password.belongsTo(User, { foreignKey: 'userId', as: 'users' });

    //  اول حاجه اليوزر ,السيتينج(one to one)
    User.hasOne(UserSetting, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'settings' });
    UserSetting.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'users' });

    Website.hasMany(Password, { foreignKey: 'websiteId', as: 'passwords' });
    Password.belongsTo(Website, { foreignKey: 'websiteId', as: 'website' });
    // sequelize.sync() بتربط الكود بتاعك والكونفجريشن الي عملتها بالداتابيز ولو في حاجه غلط هتعمل ايرور
    await sequelize.sync();
  } catch (err) {
    // لو حصل ايرور فالبرنامج ملهوش لازمه انه يفضل شغال ومفيش داتابيز
    // في الحاله دي بنعمل exit
    // ورقم 1 بتدل ان حصل خطأ
    console.error('Cannot connect to database', err);
    process.exit(1);
    // كده المفروض فهمت الداتابيز وتقسيمتها وازاي تعمل الكونفجريشن بتاعتها
    // ممكن دلوقتي تشوف هنتعامل ازاي مع الاخطاء الي هتقابلنا
    // افتح ملف ./lip/errors/error-request.ts
  }
};
