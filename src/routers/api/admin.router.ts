// هنا هتبقا الروتس الخاصه بالادمن
import { Router } from 'express';
import * as controllers from '../../controllers/admin.controller';
import Validator from '../../lib/validator';
import validateBody from '../../middleware/validate-body';
import useAsync from '../../utils/useAsync';
import isAuth from '../../middleware/isAuth';
const router = Router();

// عشان الادمن يعمل login
router.post('/login', validateBody(Validator.loginBody), useAsync(controllers.login));

router.post('/create-owner', validateBody(Validator.createAdminBody), useAsync(controllers.createOwner));

router.post('/create-admin', isAuth, validateBody(Validator.createAdminBody), useAsync(controllers.createOwner));

//عشان نمسح ادمن
router.delete('/delete-admin/:id', isAuth, useAsync(controllers.removeAdmin));
// عشان نضيف موقع جديد

export default router;
