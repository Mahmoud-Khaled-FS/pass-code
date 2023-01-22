import { RequestHandler } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import User from '../database/models/user.model';
import { throwErrorRequest } from '../lib/errors/error-request';
import { Op } from 'sequelize';

// ده المفتاح الي هنستخدمه واحنا بنعمل التوكين
const jwtKey = process.env.TOKEN_KEY || 'JWT--%@#Token';

// دي الفانكشن المسوؤله عن انك تعمل user جديد في الداتا بيز
export const register: RequestHandler = async (req, res) => {
  // اول حاجه لازم نتاكد ان الايميل او اسم المستخدم مش متسجلين قبل كده
  //  findOne فانكشن بتعمل سيرش في الداتا بيز
  // Op.or عشان تقول انك عايز تدور علي الاكونتات او اليوزر نيم الي مبعوتين في الريقويست
  const userExist = await User.findOne({ where: { [Op.or]: { email: req.body.email, userName: req.body.userName } } });
  // لو السمتخدم موجود في الحاله دي مينفعش نعمل اكونت جديد وهنبعتله ايرور
  if (userExist) {
    // دي الفانكشن الي عملناها عشان تختصر علينا نعمل ايرور جديد كل مره
    // طبعا هتبعتله الايميل او اليوزر نيم حد فيهم معمول قبل كده وايرور 400
    return throwErrorRequest(`${userExist.email === req.body.email ? 'Email' : 'userName'} is already registered`, 400);
  }
  // لو اول مره يعمل اكونت في الحاله دي هنبدا نجهز الداتا انها تتخزن في الداتا بيز
  // اول حاجه مينفعش نخزن الباسورد زي ما السمستخدم بيكتبه
  // وارد ان الداتابيز يتم اختراقها واكيد مش هتحب الاكونتات بالباسورد تكون معروضين قدامه
  // هنا بقا هنشفر الباسورد قبل ما نخزن
  // مكتبه bcrypt هتشقر الباسورد
  const passwordHashed = await bcrypt.hash(req.body.password, 16);
  // لو حصل مشاكل والباسورد متشفرش هنبعت ايرور ان في مشكله في السيرفر
  if (!passwordHashed) {
    return throwErrorRequest('Internal Server Error', 500);
  }
  // الصوره الشخصيه للاكونت مش اجباري فممكن المستخدم ميرفعهاش في الحاله دي هنحط صوره افتراضيه من عندنا
  const image = req.file?.filename || 'default.png';
  // هنعملمستخدم جديد في الداتابيز من فانكشن create
  const user = await User.create({ ...req.body, imageProfile: image, password: passwordHashed });
  // بعد كده هنعمل row جديد في جدول الاعدادات
  // createSettings واحده من الفانكشن الجاهزه الي المكتبه بتعملهالك
  // لو الموضوع لخبط معاك ممكن تراجع الموديلز User
  const settings = await user.createSettings();
  // هنا بنحفظ الsettings في الداتابيز
  await settings.save();
  // send email handle
  // المفروض هنا نبعت ايميل للمستخدم انه ياكد هويه

  // بعدين هنجيب المعلومات الي محتاجين نخزنها في التوكين
  const tokenPayload = user.forToken();
  // هنعمل التوكين باستخدام مكتبه ال jwt
  // هشرح قدام يعني ايه توكين وازاي بتستخدم
  const token = jwt.sign(tokenPayload, jwtKey, { expiresIn: '1w' });
  // اخر حاجه هنبعت الكلاينت
  // 201 = created
  return res.status(201).json({ token, ...user.response() });
};

// الفانكشن المسؤوله عن انك تعمل تسجيل دخول
export const login: RequestHandler = async (req, res) => {
  // اول حاجه هندور علي الايميل موجود في الداتابيز ولا لا
  const user = await User.findOne({ where: { userName: req.body.userName } });
  // لو المستخدم مش موجود هنبعت ايرور
  if (!user) {
    return throwErrorRequest('Username is not exists', 400);
  }
  // لو موجود هنتاكد من صحه الباسورد
  // طبعا الباسورد متخزن في الداتابيز متشفره فمينفعش نقارنهم بال =
  // هنستخدم مكتبه bcrypt تاني عشان تعمل هي المقارنه
  const isCorrectPassword = await bcrypt.compare(req.body.password, user.password);
  // لو الباسورد مش صح هنبعت ايرور ان الباسورد غلط
  if (!isCorrectPassword) {
    return throwErrorRequest('wrong password', 401);
  }
  // لو صح يبقا احنا اتاكدنا من هويه اليوزر وهنبعتله معلوماته في الداتابيز
  // وطبعا لازم يكون في توكين يتبعت للكلاينت
  const tokenPayload = user.forToken();
  const token = jwt.sign(tokenPayload, jwtKey, { expiresIn: '1w' });

  return res.status(200).json({ token, ...user.response() });
};

// للاسف الكنترولرز الخاص بالايميلات متعملتش :"(
export const confirmAccount: RequestHandler = () => {};

export const forgotUserName: RequestHandler = () => {};

export const forgotPassword: RequestHandler = () => {};

export const confirmResetPassword: RequestHandler = () => {};
