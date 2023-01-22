/*
  uploadFile: عباره عن middleware 
  فكرتها انها بتعامل مع الملفات اليالمستخدم بيرفعها 
  في حاله البرنامج بتاعنا مفيش ملفات هتترفع غير صوره البروفايل
*/
import { randomUUID } from 'crypto';
import { RequestHandler } from 'express';
import multer from 'multer';
import path from 'path';
import { throwErrorRequest } from '../lib/errors/error-request';

// اول حاجه هنعمل الكونفجريشن بتاعه multer
const profileStorage = multer.diskStorage({
  destination(_, __, callback) {
    callback(null, path.join(__dirname, '..', '..', 'public', 'images')); // فانكشن مهمتها انها تحدد مكان الفايل هيترفع فين
  },
  filename(_, file, callback) {
    // فانكشن بتحدد اسم الملف
    const uuid = randomUUID().toString(); // هنا بعمل uuid تجنبا لو المستخدم رفع صوره اسمها كان موجود بالفعل;
    callback(null, uuid + '-' + file.originalname);
  },
});

// هنا بندي الكونفجريشن للمكتبه عشان ترجعلنا ال middleware الي هنستخدمها
// لو عايز تتعلم اكتر عن multer ممكن تخش علي اللينك ده
// https://www.npmjs.com/package/multer
const upload = multer({
  storage: profileStorage,
}).single('imageProfile');

// اخر حاجه هو اننا هنمل فانكشن تهاندل الايرور الي ممكن تحصل لو الصوره مترفعتش
export const uploadFile: RequestHandler = (req, res, next) => {
  upload(req, res, function (err) {
    try {
      if (err instanceof multer.MulterError) {
        return throwErrorRequest('profile image cannot upload', 400);
      } else if (err) {
        return throwErrorRequest('profile image cannot upload', 400);
      }
      return next();
    } catch (err) {
      next(err);
    }
  });
};
