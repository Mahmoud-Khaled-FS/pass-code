import { RequestHandler } from 'express';
import { ValidationResult } from 'joi';
import { throwErrorRequest } from '../lib/errors/error-request';

/*
  middleware مسؤوله عن انها تعمل فالديت للداتا الي في ال body 
  ولو فيها اي مشاكل تبعت ايرور للكلاينت
*/
const validateBody = (validator: (body: any) => ValidationResult) => {
  //الاول بستخدم الفانكشن دي وبديها نوع الفالديت الي محتاجه وهي بترجع الميديلوير
  const validateMiddleware: RequestHandler = (req, _, next) => {
    const validateBody = validator(req.body); // دي الفالديتور الي عملناها في ال ('../validator.ts');
    if (validateBody.error) {
      // لو في اي ايرور في الداتا بنبعت ايرور للكلاينت
      return throwErrorRequest(validateBody.error.message, 400);
    }
    req.body = validateBody.value; // لو تمام بنستبدل ال body بالداتا بعد ما اتعملها فالديت
    return next();
  };
  return validateMiddleware;
};

export default validateBody;
