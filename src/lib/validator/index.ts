import {
  createAdminValidator,
  loginAdminValidator,
  loginValidator,
  passwordValidator,
  registerValidator,
} from './auth';
import { passwordBodyValidator } from './password';
import { editUserValidator } from './user';
// هتوقع انك جيت هنا بعد ما شفت ال auth كنترولر
// لازم المبرمج ميثقش في المستخدم انه هيبعت الداتا صح
// لازم تراج الداتا وراه
// هنا انا بعمل كلاس فيه مجموعه من الميثودس الي بتعمل الفالديت
// كلهم نفس الفكره لو حابب تشوفهم كلهم اوك بس انا هشرح ملف auth بس (./auth.ts)
class Validator {
  static loginBody(body: any) {
    // عملنا export للفاديتور الي هيتاكد من الداتا
    // ومتوقعين ان الفانكشن هيتبعتلها ال body تراجعه
    // validate فانكشن بتتاكد من الداتا
    const validBody = loginValidator.validate(body);
    return validBody;
  }
  static loginAdminBody(body: any) {
    // عملنا export للفاديتور الي هيتاكد من الداتا
    // ومتوقعين ان الفانكشن هيتبعتلها ال body تراجعه
    // validate فانكشن بتتاكد من الداتا
    const validBody = loginAdminValidator.validate(body);
    return validBody;
  }
  static registerBody(body: any) {
    const validBody = registerValidator.validate(body);
    return validBody;
  }
  static createAdminBody(body: any) {
    const validBody = createAdminValidator.validate(body);
    return validBody;
  }
  static updatePassword(body: any) {
    const validBody = passwordValidator.validate(body.password);
    return validBody;
  }
  static editUserBody(body: any) {
    const validBody = editUserValidator.validate(body);
    return validBody;
  }
  static passwordBody(body: any) {
    const validBody = passwordBodyValidator.validate(body);
    return validBody;
  }
}

export default Validator;
