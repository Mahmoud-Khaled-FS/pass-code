import Joi from 'joi';
// الموضوع مفهوش شرح كتير المكتبه بتقدملك مجموعه من الفانكشن الي بتستخدمها عشان تفالديت الداتا
// لو حابب تتعمق اكتر خش علي اللينك ده
// https://joi.dev/
/*
  هشرح بعض الفانكشن وانت لو حبيت تتعمق خش الموقع بتاعهم 
  string -number - object - array ده عشان تحدد نوع الداتا
  max - min عشان تحدد عدد الحروف في رينج محدد 
  trim بيشيل ال withe space
  required في الطبيعي بيكون العنصر مش اجباري بس لو استخدمها فلو هي مش موجوده هيعمل ايرور
  pattern لو هتستخدم regex
  default لو القيمه مش موجوده هو هيحط القيمه الافتراضيه الي هتختارها
  label ده الاسم الي هيرجعلك في الايرور
*/
export const passwordValidator = Joi.string()
  .min(8)
  .max(50)
  .pattern(/[a-z]/)
  .pattern(/[A-Z]/)
  .pattern(/[0-9]/)
  .pattern(/[$&+,:;=?@#|'<>.^*()%!-]/)
  .required()
  .label('password');

export const loginValidator = Joi.object({
  userName: Joi.string().max(55).trim().required().label('userName'),
  password: passwordValidator,
});
export const loginAdminValidator = Joi.object({
  email: Joi.string().email().required().label('email'),
  password: passwordValidator,
});

export const registerValidator = Joi.object({
  userName: Joi.string().max(55).trim().required().label('userName'),
  password: passwordValidator,
  email: Joi.string().email().trim().required().label('email'),
  firstName: Joi.string().min(2).max(25).trim().required().label('firstName'),
  lastName: Joi.string().min(2).max(25).trim().required().label('lastName'),
  DOB: Joi.string().isoDate().required().label('DOB'),
  phone: Joi.string().min(4).max(55).trim().pattern(/[0-9]/).default(null).label('phone'),
});
export const createAdminValidator = Joi.object({
  password: passwordValidator,
  email: Joi.string().email().trim().required().label('email'),
  firstName: Joi.string().min(2).max(25).trim().required().label('firstName'),
  lastName: Joi.string().min(2).max(25).trim().required().label('lastName'),
});
