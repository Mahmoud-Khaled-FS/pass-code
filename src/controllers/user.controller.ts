import { RequestHandler } from 'express';
import { unlink } from 'fs/promises';
import path from 'path';
import User from '../database/models/user.model';
import { throwErrorRequest } from '../lib/errors/error-request';

export const profile: RequestHandler = async (req, res) => {
  // هنا هنجيب الداتا من الداتا بيز بال id
  const user = await User.getUserFromRequest(req);
  return res.status(200).json(user.response());
};

export const edit: RequestHandler = async (req, res) => {
  // هنا هنعدل علي الداتا
  const hasNoData = Object.keys(req.body).length === 0;

  // لو مفيش داتا اتبعتت هنبعت ايرور
  if (hasNoData) {
    return throwErrorRequest('bad request', 400);
  }
  // لو بعت داتا هنبحث عن المستخدم في الداتابيز
  const user = await User.getUserFromRequest(req);

  // وبعدها نعملها update
  await user.update(req.body);

  // اخر حاجه نسيفها
  await user.save();

  // ونبعت رد بالداتا الجديده
  return res.status(200).json(user.response());
};

export const deleteUser: RequestHandler = async (req, res) => {
  // لو المستخدم حب يمسح الاكونت
  // اول حاجه هنجيب اليوزر من الداتابيز
  const user = await User.getUserFromRequest(req);
  // بعدها نمسح الصوره بتاعته من ملفات السيرفر
  if (user.imageProfile !== 'default.png') {
    await unlink(path.join(__dirname, '..', '..', 'public', 'images', user.imageProfile));
  }
  // اخر حاجه نمسحه من الداتابيز
  await user.destroy();
  // ونبعت الرد
  return res.sendStatus(204);
};

export const settings: RequestHandler = async (req, res) => {
  // نفس فكره انك تبعت الاكونت
  const user = await User.getUserFromRequest(req);
  // بس هنعمل خطوه كمان ونجيب الاعدادات بتاعه المستخدم من الداتابيز
  const settings = await user.getSettings();
  // بعدين نبعها في الرد
  return res.status(200).json(settings.toJSON());
};

export const disabledUser: RequestHandler = async (req, res) => {
  // نفس خطوات المسح بس بدل ما نسح هنعدل علي عمود disabled ونخليه true
  const user = await User.getUserFromRequest(req);
  user.disabled = true;
  await user.save();
  return res.sendStatus(204);
};
