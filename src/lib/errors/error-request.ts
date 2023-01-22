import { ErrorRequestHandler } from 'express';
import { unlink } from 'fs/promises';

// الايرور هاندلينح عباره عن ميدلوير مسؤله ان لما يحصل اي ايرور في اي كنترول يتبعت هنا
// استخدمت الفانكشن دي في ملف (./app.ts : 33)
export const errorRequestHandler: ErrorRequestHandler = async (err, req, res, __) => {
  // اول حاجه هتاكد منها ان المستخدم عمل ابلود لفايل
  // لو لسببا ما حصل ايرور فانا مبقتش محتاج الملف ده عندي علي السيرفر
  //  unlink  فانكشن في النود جي اس بتقدر بيها تمسح الملفات
  //  req.file بتيجي من مكتبه multer
  if (req.file) {
    await unlink(req.file.path);
  }
  // في الاخر ببعت response بالرساله الي حابب ابعتها للكلاينت في صوره json
  return res.status(err.code || 500).json({ code: err.code, status: 'failed', message: err.message });
};

// في العادي ال Error اوبجيكت مفهوش كود فبعمل interface بياخد خصائص الايرور واضيف عليه الي انا عايزه
export interface ErrorRequest extends Error {
  code?: number;
}

// دي فانكشن بسيطه بتختصر كتابه الكام سطر دول كل ما يكون في ايرور
export const throwErrorRequest = (message: string, code?: number) => {
  // بعمل ايرور اوبجيكت وبديله التايب الي عملته فوق عشان اعرف اديله code
  const err: ErrorRequest = new Error(message);
  err.code = code || 500;
  // اخر حاجه بعمل ثرو للايرور عشان تروح للفانكشن الي فوق بتاعه الايرور هاندلينج
  // الصوره هتبقا وضحالك اكتر لما نخش علي الكنترولر
  // بس قبل ما نخش علي الكنترولر نبص علي الروتس هتبقا عامله ازاي
  // (./routers/index.router.ts)
  throw err;
};
