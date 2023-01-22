import { Router } from 'express';

import * as controllers from '../controllers/api.controller';
import isAuth from '../middleware/isAuth';
import authRouter from './api/auth.router';
import passowrdRouter from './api/password.router';
import userRouter from './api/user.router';
import useAsync from '../utils/useAsync';

/*
  فكره الروتر بسيطه
  الملف ده الي بجمع فيه كل الروترس
  بعمل router من express.Router()
  بعدين بديله الروتس الي عايزها 
  بتستخدم الميثود الي عايزها [get, post, delete, patch, put]
  وممكن برده تستخدم مجموعه من الروتس  بانك تستخدم use
  في الاخر بعمل export للروتر الي عملنا والي هو مجمع كل الروترس
  وبنستخدمه في الابلكيشن هتلاقيع في ملف (./app.ts)
  المفروض تكون عارف express وفاهم الروتس 
  بس شرح مبسط ليها 
  اول برام بيبقا string 
  وده في ال path 
  مثال '/user' => http://localhost:port/user
  تاني برام هي ال middlewares الي بتهاندل عمليه الrequest
  دلوقتي افتح فولدر الapi
  هتلاقي ملفات الروترس افتح اي ملف وهتلاقي في ملفات الكنترولر ملف بنفس الاسم افتح الاتنين قصاد بعض
  (./api) | (../../controllers)
  بنصحك بالترتيب ده [auth - user - password]
*/
const router = Router();

router.get('/websites', controllers.getWebsites);
// عشان نعمل random password للمستخدم
router.get('/generate-password', useAsync(controllers.generateRandomPassword));

router.use('/auth', authRouter);
router.use('/user', isAuth, userRouter);
router.use('/p', isAuth, passowrdRouter);

export default router;
