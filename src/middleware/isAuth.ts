import { RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';
import { throwErrorRequest } from '../lib/errors/error-request';

/*
  التوكين باختصار طريقه تثبت هويتك للسيرفر
  يعني ايه الي هيخليه يعرف انك مستخدم علي السيرفر ؟
  اكيد مش كل مره هتكتبه الاكونت والباسورد
  فالي بيحصل هو انك لما بتعمل تسجيل دخول هو بيبعتلك حاجه اسمها توكين 
  التوكين ده عباره عن نص متشفر فيه معلومات عنك زي الاي دي والايميل 
  وانت لما تيجي تبعت ريكوست للسيرفر بتبتعتله التوكين ده 
  السيرفر بيبص عليه يتاكد انه هو الي عامله وان الداتا الي فيه صح بعدها يبعتلك الداتا
  غير كده هيبعتلك ايرور 
  التوكين ده بقا بنبعته في ال header بتاع الريكوست 
  بالتحديد في Authorization 
  والمتعارف عليه ان التوكين بيبقا قبليه كلمه bearer
  فبيبقا شكل الهيدر الاتي
  header:{
    "Authorizaton": "bearer token"
  }
  والميديلوير دي فايدتها انها تتاكد من وجود التوكين وانه سليم وتستخرج منه ال id بتاع المستخدم
  خد بالك ان لازم الميديلوير دي تكون اول حاجه عشان نتاكد من الهويه قبل ما نعمله الي هو عايزه
*/

// اول حاجه محتاجين المفتاح الي اتخدمناه عشان نعمل التوكين في ال auth controller
const jwtKey = process.env.TOKEN_KEY || 'JWT--%@#Token';

const isAuth: RequestHandler = (req, _, next) => {
  const authHeader = req.get('Authorization'); // اول حاجه بنجيب الداتا الي في الهيدر
  if (!authHeader) {
    return throwErrorRequest('not authorized', 401); // لو مش موجود بنبعت ايرور
  }
  const token = authHeader.split(' ')[1]; // بنفصل اول كلمه الي هي bearer مش محتاجينها وبناخد اتوكين
  const decodedToken = jwt.verify(token, jwtKey) as any; // بنعمله تاكيد من نفس المكتبه الي عملنا بيها التوكين
  if (!decodedToken) {
    // لو مطلعش الداتا يبقا فيه مشاكل وبنبعت ايرور
    return throwErrorRequest('Not authenticated', 401);
  }
  req.userId = decodedToken.id; // لو طلعها بنخزن ال id في الريكوست ونستخدمه في اي ميديلوير تانيه
  return next();
};

export default isAuth;
