/*
  شكل الروتر بيبقا كالتالي
  router.method('path',...middleware)
  ال method ده بيحدد نوع الريقوست سواء بوست او جيت 
  ال path وهو مسار ال url بتاع الايند بوينت 
  الmiddlewares مجموعه من المراحل الي بيمر عليها الريقوست قبل ما يبعت الريسبونس
  هقلك تشوفهم امتي بالترتيب 
 */
import { Router } from 'express';
import * as controllers from '../../controllers/auth.controller';
import Validator from '../../lib/validator';
import { uploadFile } from '../../middleware/profile-uploader';
import validateBody from '../../middleware/validate-body';
import useAsync from '../../utils/useAsync';

const router = Router();

/*
  اول ايندبوينت والي مسؤوله عن ان المستخدم يعمل تسجيل دخول
  قبل ما تخش علي الكونترول بتاعها في middleware خش شوفها 
  (../middleware/profile-uploader.ts)
  لو شفت ال middleware ممكن دلوقتي تشوف الكنترولر المسؤول عنها 
*/
router.post('/register', uploadFile, validateBody(Validator.registerBody), useAsync(controllers.register));
// فهمت اول روتر ؟
// فهمت الكنترولر بتشتغل ازاي وبتعمل ايه ؟
// اكيد سالت نفسك ليه حاطت الcontroller جوا فانكشن
// قبل ما تخش علي الكنترولر الجايه شوف useAsync بتعمل ايه(../../utils/useAsync.ts)

// انت دلوقتي فهمت ال router والكنترولر مش لازم اشرح ده تاني كل مره
// دلوقتي ممكن تشوف ازاي بنعمل validate للداتا الي جايه من اليوزر قبل ما نكمل باقي الروتر
// (../../lip/validator.ts)
// بعد ما شفت ازاي بتعمل الفالديت الي عايز تعمله للداتا
// دلوقتي هتعرف ازاي بستخدمه
// هتلاقي middleware (../../middleware/validate-body.ts)
// خش شوفها بعدين خش علي ال user router
router.post('/login', validateBody(Validator.loginBody), useAsync(controllers.login));

//  دي روترس مسوؤله عن انك تبعت ايميلات بس عندي مشكله في حوار الايميلات ده فمعرفتش اعملها
router.get('/confirm-account', useAsync(controllers.confirmAccount));

router.get('/forgot-username', useAsync(controllers.forgotUserName));

router.get('/forgot-password', useAsync(controllers.forgotPassword));

router.post(
  '/confirm-reset-password',
  validateBody(Validator.updatePassword),
  useAsync(controllers.confirmResetPassword),
);

export default router;
