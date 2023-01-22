import Joi from 'joi';

export const passwordBodyValidator = Joi.object({
  password: Joi.string().trim().default('').label('password'),
  title: Joi.string().trim().max(55).required().label('title'),
  email: Joi.string().email().label('email'),
  userName: Joi.string().trim().max(255).label('userName'),
  phone: Joi.string().min(4).max(55).trim().pattern(/[0-9]/).label('phone'),
  url: Joi.string().label('url'),
  websiteId: Joi.number().integer().label('websiteId'),
});
