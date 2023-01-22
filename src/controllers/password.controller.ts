/*
  من الحاجات الي فكرت فيها وانا بعمل المشروع ده
  ان مينفعش اخزن الداتا بتاعه المستخدم زي ما هو كاتبها
  لازم تتشفر عشان الحمايه وفي نفس الوقت اعرف افك تشفيرها عشان ارجعهاله 
  وعملت فانكشنز مسؤوله عن التشفير وفك التشفير
  هتلاقيهم في (../lip/encrypt/index.ts)
*/

import { RequestHandler } from 'express';
import User from '../database/models/user.model';
import Website from '../database/models/website.model';
import { encrypt, generateIv } from '../lib/encrypt';
import { throwErrorRequest } from '../lib/errors/error-request';
import { PasswordsResponse } from '../types/response';
import { checkAllPasswordHealth, checkOnePasswordHealth } from '../lib/health';

export const create: RequestHandler = async (req, res) => {
  // اول حاجه هنجيب المستخدم من الداتابيز
  const user = await User.getUserFromRequest(req);
  // بعدها نسخرج المعلومات من ال body
  const { password, title, email, phone, url, userName, websiteId } = req.body;
  let website; // ده زي كاتجوري ككده لو المستخدم حب يعملها او لا
  if (websiteId) {
    website = await Website.findByPk(websiteId); // لو الويبسايت مش موجود هبعت ايرور
    if (!website) {
      return throwErrorRequest('invalid websiteId', 400);
    }
  }
  const iv = generateIv(); // زي مفتاح ليه علاقه بالتشفير
  // بعدين هنشفر الداتا الي محتاجين نشفرها
  const encryptedPassword = encrypt(password, iv);
  const encryptUserName = userName ? encrypt(userName, iv) : null;
  const encryptedEmail = email ? encrypt(email, iv) : null;
  const encryptedPhone = phone ? encrypt(phone, iv) : null;
  const passwordAttriputes = {
    iv: encryptedPassword.iv,
    password: encryptedPassword.encryptedData,
    title: title,
    ...(encryptedEmail && { email: encryptedEmail.encryptedData }),
    ...(encryptUserName && { userName: encryptUserName.encryptedData }),
    ...(encryptedPhone && { phone: encryptedPhone.encryptedData }),
    url: url,
  };
  // نعمل باسورد جديد فيه علاقه بينه وبين المستخدم
  const passwordData = await user.createPassword(passwordAttriputes);
  if (website) {
    website.addPassword(passwordData); // بنضيفه للويبسايت برده لو موجود
  }
  // اخر حاجه بنبعت الرد بالباسورد
  return res.status(201).json({
    ...passwordData.response(),
    ...(website && { website: { name: website.name, icon: website.icon, url: website.url, id: website.id } }),
  });
};

// هنا الباسوردس مممكن تبقا كتير فمينفعش تتبعت مره واحده
// فبنقسمها لاجزا ونبعتهم علي انهم صحف وهو يختار عايز انهي page
export const getAllPasswords: RequestHandler = async (req, res) => {
  const user = await User.getUserFromRequest(req);
  let page = req.query.page as string; //لو المستخدم محدد صفحه ولو مش محدد بيبقا اول صفحه
  let pageNumber = page ? +page : 1;
  if (isNaN(pageNumber)) {
    pageNumber = 1;
  }
  const pageSize = 50; // الباسوردات في الصفحه عددها 50
  const offset = pageSize * (pageNumber - 1); // هنا بنحسب هنعدي كام باسورد في الداتا بيز عشان نوصل للصفحه الي المستخدم طالبها
  const passwords = await user.getPasswords({
    limit: pageSize,
    offset: offset,
    order: [['createdAt', 'DESC']],
  }); // بنبحث عنهم عادي في الداتابيز
  const totalPasswords = await user.countPasswords(); // بنجيب العدد الكلي للباسوردات

  const totalPages = Math.ceil(totalPasswords / pageSize); // نحدد عدد الصفح بناء علي العدد الكلي للباسوردات

  const passwordsResponse: PasswordsResponse = {
    data: passwords.map((p) => p.groupResponse()),
    totalItems: totalPasswords,
    currentPage: pageNumber,
    totalPages,
  }; // بعدين نبعت response بالمعلومات دي
  res.status(200).json(passwordsResponse);
};

// عشان تجيب معلومات باسورد من الداتابيز
export const getPassword: RequestHandler = async (req, res) => {
  const user = await User.getUserFromRequest(req);
  const passwords = await user.getPasswords({
    where: { id: req.params.id }, // عشان نحدد انهي باسورد عايزينه
    include: { model: Website, as: 'website' },
  });
  if (passwords.length === 0) {
    return throwErrorRequest('password not found', 404);
  }
  const passwordResponse = passwords[0].response();
  return res.status(200).json(passwordResponse);
};

// عشان تمسح باسورد من الداتابيز
export const deletePassword: RequestHandler = async (req, res) => {
  const user = await User.getUserFromRequest(req);
  const id = Number(req.params.id);
  await user.removePassword(id);
  return res.sendStatus(204);
};
// عشان نتحقق من قوه باسورد
export const checkPasswordHealth: RequestHandler = async (req, res) => {
  const user = await User.getUserFromRequest(req);
  const passwords = await user.getPasswords({
    where: { id: req.params.id },
    attributes: ['password', 'iv'], // هنا بنحدد الاعمده الي عايزنها ترجع من الداتابيز
  });
  if (passwords.length === 0) {
    return throwErrorRequest('password not found', 404);
  }
  const password = passwords[0].decryptPassword();
  const passwordHealth = checkOnePasswordHealth(password);
  return res.status(200).json(passwordHealth);
};
// عشان نتحقق من قوه كل الباسوردات بتاعه المستخدم
export const checkAllPasswordsHealth: RequestHandler = async (req, res) => {
  const user = await User.getUserFromRequest(req);
  const passwords = await user.getPasswords({
    attributes: ['password', 'iv', 'id'], // هنا بنحدد الاعمده الي عايزنها ترجع من الداتابيز
  });
  if (passwords.length === 0) {
    return res.status(200).json([]);
  }
  const passwordsForCheck = passwords.map((p) => ({ password: p.decryptPassword(), id: p.id }));
  const passwordsHealth = checkAllPasswordHealth(passwordsForCheck);
  return res.status(200).json(passwordsHealth);
};
