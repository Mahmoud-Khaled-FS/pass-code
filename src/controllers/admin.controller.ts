import { RequestHandler } from 'express';
import Admin from '../database/models/admin.model';
import { throwErrorRequest } from '../lib/errors/error-request';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const jwtKey = process.env.TOKEN_KEY || 'JWT--%@#Token';

// نفس الكنترولر بتاعه ال login بتاعه الuser
export const login: RequestHandler = async (req, res) => {
  const admin = await Admin.findOne({ where: { email: req.body.email } });
  if (!admin) {
    return throwErrorRequest('adminname is not exists', 400);
  }
  const isCorrectPassword = await bcrypt.compare(req.body.password, admin.password);
  if (!isCorrectPassword) {
    return throwErrorRequest('wrong password', 401);
  }
  const token = jwt.sign({ id: admin.id }, jwtKey, { expiresIn: '1w' });

  return res.status(200).json({ token, ...admin.toJSON() });
};

// ده عشان نعمل اونر لاول مره لما المشروع يبدا
export const createOwner: RequestHandler = async (req, res) => {
  const ownerExist = await Admin.findOne({ where: { role: 'owner' } });
  if (ownerExist) {
    return throwErrorRequest('owner Already exist', 401);
  }
  const owner = await Admin.create({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
    role: 'owner',
  });
  return res.status(201).json(owner.toJSON());
};

export const createAdmin: RequestHandler = async (req, res) => {
  const admin = await Admin.findByPk(req.userId);
  if (!admin) {
    return throwErrorRequest('can not access', 401);
  }
  const adminExist = await Admin.findOne({ where: { email: req.body.email } });
  if (adminExist) {
    return throwErrorRequest('admin is already added');
  }
  const newAdmin = await Admin.create({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
    role: 'admin',
  });
  return res.status(201).json(newAdmin.toJSON());
};

export const removeAdmin: RequestHandler = async (req, res) => {
  const admin = await Admin.findByPk(req.userId);
  if (!admin) {
    return throwErrorRequest('can not access', 401);
  }
  if (admin.role !== 'owner') {
    return throwErrorRequest('Not authenticated', 401);
  }
  await Admin.destroy({ where: { id: req.params.id } });
  return res.sendStatus(204);
};
