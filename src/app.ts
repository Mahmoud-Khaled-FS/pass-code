// هقسم ال ملفات الي بستدعيها لمجموعتين الاولي الي تبع مكتبات خارجيه لو حبيت تعرف اكتر عنها ممكن تسيرش عليها
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

// التاني ملفات تبع المشروع نفسه ممكن تتجاهلها حاليا ولما يجي وقتها هقلك مكان الملف وتشوف محتواه
import db from './database';
import routers from './routers/index.router';
import { errorRequestHandler } from './lib/errors/error-request';

// دي الفانكشن الرئيسه الي بيبدا عندها البرنامج
const run = async () => {
  // اول حاجه بنعمل البرنامج
  // طبعا لازم نكون عارف ازاي express بيشتغل
  const app = express();

  // هنا بنضيف ال middleware الاساسيه للبرنامج الي اي route لازم يعدي عليها
  app.use(helmet());
  app.use(cors());
  app.use(bodyParser.json());

  // express.static انت هنا بتعرف ملف ممكن اي حد يوصل للمحتوي الي جواه
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // دي ملفات المشروع الاساسيه
  // اول حاجه ال routes بتاعه البرنامج
  app.use(routers);
  // تاني واحد عشان اي routes غلط يبعت 404
  app.use('*', (_, res) => res.status(404).send('Not found'));
  // تالت حاجه روت عشان يهاندل الايرورز الي ممكن تحصل
  app.use(errorRequestHandler);

  // بعدها نبدأ نعرف الداتابيز ونجز الموديلز
  await db();

  // اخر حاجه بنعمل run للسيرفر ويبقا مستعد يستقبل ريكوستس
  app.listen(5000, () => {
    console.log('http://localhost:5000');
  });
  // كده ممكن نخش علي الداتابيز
  // ./database/index.ts
};

export default run;
