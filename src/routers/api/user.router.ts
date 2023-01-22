import { Router } from 'express';
import * as controllers from '../../controllers/user.controller';
import Validator from '../../lib/validator';
import validateBody from '../../middleware/validate-body';
import useAsync from '../../utils/useAsync';
const router = Router();

// الاول محتاج تعرف ازاي بنجيب الid بتاع السمتخدم ويعني ايه توكين
// روح لاخر middleware (../../middleware/isAuth.ts)

// router => لو الكلاينت عايز معلومات المستخدم
router.get('/profile', useAsync(controllers.profile));

// router => عشان المستخدم يعدل علي الداتا بتاعته
router.patch('/edit', validateBody(Validator.editUserBody), useAsync(controllers.edit));

// router => عشان لو المستخدم حب يمسح الاكونت
router.delete('/delete', useAsync(controllers.deleteUser));

// router => عشان لو المستخدم حب يوقف الاكونت
router.delete('/disabled', useAsync(controllers.disabledUser));

// router => عشان لو الكلاينت محتاج الاعدادات بتاعه المستخدم
router.get('/settings', useAsync(controllers.settings));

export default router;
