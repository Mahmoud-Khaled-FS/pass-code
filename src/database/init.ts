import { Sequelize } from 'sequelize';
// اول حاده بنجيب الداتا من ال .env
const databaseName = process.env.DATABASENAME!;
const databaseUserName = process.env.DATABASEUSERNAME!;
const databasePasswprd = process.env.DATABASEPASSWORD!;
const databaseUri = process.env.DATABASEURI!;

// نبدا نعمل اتصال جديد مع الداتابيز
// في حاله البرنامج بتاعي استخدمت mysql
// دي الكونجريشن الي غالبا هتحتاج تعملها
// لو حبيت تتعمق اكتر او تستخدم نوع داتابيز مختلفه ممكن تخش علي موقع seqluelize
// https://sequelize.org/
const sequelize = new Sequelize(databaseName, databaseUserName, databasePasswprd, {
  host: databaseUri,
  dialect: 'mysql',
});

export default sequelize;
