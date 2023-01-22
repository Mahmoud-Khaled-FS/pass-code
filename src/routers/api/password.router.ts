import { Router } from 'express';
import * as controllers from '../../controllers/password.controller';
import Validator from '../../lib/validator';
import validateBody from '../../middleware/validate-body';
import useAsync from '../../utils/useAsync';
const router = Router();

// عشان تضيف باسورد جديد
router.post('/new', validateBody(Validator.passwordBody), useAsync(controllers.create));

// عشان تمسح باسورد
router.delete('/delete/:id', useAsync(controllers.deletePassword));

// عشان تجيب الباسوردات الي عملتها
router.get('/', useAsync(controllers.getAllPasswords));

// التحقق من قوه كل الباسوردس بتاعه المستخدم
router.get('/health', useAsync(controllers.checkAllPasswordsHealth));
// التحقق من قوه الباسورد
router.get('/health/:id', useAsync(controllers.checkPasswordHealth));

// عشان تجيب المعلومات الكامله للباسورد
router.get('/:id', useAsync(controllers.getPassword));

export default router;
