import { NextFunction, Request, RequestHandler, Response } from 'express';
// الفانكشن دي بسيطه خالص حتي مش محتاج تقعد وقت فيها
// ببساطه انها بتخلي الكنترول تبقا متحاطه ب try - catch
// في العادي لازم تستخدم try catch عشان البرنامج ميموتش مع اول ايرور
// وبدل ما بنكتبهم مع كل كنترولر بنعمل فانكشن وتوفر علينا كتابتهم كل مره
const useAsync = (middleware: RequestHandler) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await middleware(req, res, next);
    } catch (err) {
      if (!err.code) {
        err.code = 500;
      }
      next(err);
    }
  };
};

export default useAsync;
