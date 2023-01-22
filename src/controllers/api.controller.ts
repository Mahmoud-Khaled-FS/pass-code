import { faker } from '@faker-js/faker';
import { RequestHandler } from 'express';
import { throwErrorRequest } from '../lib/errors/error-request';
import Website from '../database/models/website.model';

export const getWebsites: RequestHandler = async (_, res) => {
  const websites = await Website.findAll();
  return res.status(200).json(websites);
};

// عشان نعمل باسورد عشوائي
export const generateRandomPassword: RequestHandler = async (req, res) => {
  // اول حاجه بنشوف الاوبشن الي ممكن المستخدم يستخدمها
  const { lowercase, uppercase, special, numbers, length, readable } = req.query;
  let pattern = 'a-z0-9';
  if (lowercase && lowercase.toString().toLowerCase() === 'false') {
    pattern = pattern.replace('a-z', '');
  }
  if (uppercase && uppercase.toString().toLowerCase() === 'true') {
    pattern += 'A-Z';
  }
  if (special && special.toString().toLowerCase() === 'true') {
    pattern += /!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?/;
  }
  if (numbers && numbers.toString().toLowerCase() === 'false') {
    pattern = pattern.replace('0-9', '');
  }
  let lengthNum: number = 15;
  if (length) {
    if (!isNaN(+length)) {
      lengthNum = +length > 55 ? 55 : +length < 1 ? 1 : +length;
    }
  }
  // بعدين بنعمل باترن نستخدمه
  // لو مش موجود بنبعت ايرور
  if (!pattern) {
    return throwErrorRequest(
      'cannot create password must choose at least one option [lowercase, uppercase, special, numbers]',
      400,
    );
  }
  const memo = readable && readable.toString().toLocaleLowerCase() === 'true' ? true : false;
  // console.log(readable);
  // اخر حاجه بنعمل الباسورد ونبعته
  let password = faker.internet.password(lengthNum, memo, new RegExp(`[${pattern}]`));
  return res.status(201).json({ password });
};
